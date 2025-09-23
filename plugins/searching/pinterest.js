const axios = require('axios');
const stringSimilarity = require('string-similarity');

exports.run = {
  usage: ['pinterest'],
  hidden: ['pin'],
  category: 'searching',
  async: async (m, { erlic, text, setting, isCreator, isPrem }) => {
    if (!text) 
      return erlic.sendMessage(m.chat, { text: 'Contoh: pinterest anime' }, { quoted: m });

    const queryLower = text.toLowerCase();

    // pastikan toxic list aman
    const toxicList = Array.isArray(setting.toxic) ? setting.toxic.map(a => a.toLowerCase()) : [];
    const blacklist = ['mscbrew', 'tobrut', ...toxicList];

    // cek blacklist / fuzzy
    const isBlacklisted = blacklist.some(word => {
      const similarity = stringSimilarity.compareTwoStrings(queryLower, word);
      return similarity > 0.7 || queryLower.includes(word);
    });

    if (!isCreator && isBlacklisted) {
      const menit = ((setting.timer || 60000) / 1000 / 60);
      const user = global.db.users[m.sender] || {};
      user.banned = true;
      user.expired = user.expired || {};
      user.expired.banned = Date.now() + (setting.timer || 60000);
      global.db.users[m.sender] = user;

      return erlic.sendMessage(m.chat, {
        text: `Anda melanggar *Syarat & Ketentuan* penggunaan bot dengan menggunakan kata kunci yang masuk daftar hitam, sebagai hukuman atas pelanggaran Anda, Anda dilarang menggunakan bot selama ${menit} menit.`
      }, { quoted: m });
    }

    // react sedang diproses
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    const query = encodeURIComponent(text.trim());
    const apiUrl = `https://www.apis-anomaki.zone.id/search/pinsearch?query=${query}`;
    const response = await axios.get(apiUrl).catch(() => null);
    const data = response?.data;

    if (!data?.status || !Array.isArray(data.result) || data.result.length === 0) {
      return erlic.sendMessage(m.chat, { text: 'Gambar tidak ditemukan. Coba kata kunci lain.' }, { quoted: m });
    }

    let imageUrls = data.result
      .map(url => (url || '').trim())
      .filter(url => url && url.startsWith('http'));

    if (imageUrls.length === 0) 
      return erlic.sendMessage(m.chat, { text: 'Gambar tidak ditemukan. Coba kata kunci lain.' }, { quoted: m });

    // batasi hasil untuk non-premium
    const results = isPrem ? imageUrls.slice(0, 10) : [imageUrls[0]];

    // kirim gambar satu per satu
    for (let i = 0; i < results.length; i++) {
      const url = results[i];
      const caption = i === 0 ? `Result for \`${text}\`` : null;

      await erlic.sendMessage(m.chat, {
        image: { url: url },
        caption: caption
      }, { quoted: m });
    }

    // react selesai
    await erlic.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  },
  limit: true,
  location: 'plugins/searching/pinterest.js'
};