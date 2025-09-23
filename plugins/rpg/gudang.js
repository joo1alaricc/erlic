exports.run = {
  usage: ['gudang'],
  hidden: ['buah', 'sayur'],
  category: 'rpg',
  async: async (m, { func, erlic, setting }) => {
    // Inisialisasi proxy untuk user
    if (!global.db.users) global.db.users = {};
    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) return 0;
          return target[prop];
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        }
      });
    }

    const user = global.db.users[m.sender];

    const { 
      pisang, anggur, mangga, jeruk, apel, 
      bibitanggur, bibitapel, bibitpisang, bibitmangga, bibitjeruk,
      wortel, kentang, tomat, kubis, terong, labu,
      bibitwortel, bibitkentang, bibittomat, bibitkubis, bibitterong, bibitlabu
    } = user;

    const gudangInfo = `*HASIL PANEN BUAH*
🍌 = *[ ${pisang || 0} ]* Buah Pisang
🍇 = *[ ${anggur || 0} ]* Buah Anggur
🥭 = *[ ${mangga || 0} ]* Buah Mangga
🍊 = *[ ${jeruk || 0} ]* Buah Jeruk
🍎 = *[ ${apel || 0} ]* Buah Apel    

*HASIL PANEN SAYUR*
🥕 = *[ ${wortel || 0} ]* Wortel
🥔 = *[ ${kentang || 0} ]* Kentang
🍅 = *[ ${tomat || 0} ]* Tomat
🥬 = *[ ${kubis || 0} ]* Kubis
🍆 = *[ ${terong || 0} ]* Terong
🎃 = *[ ${labu || 0} ]* Labu

*BIBIT BUAH*
🌾 = *[ ${bibitpisang || 0} ]* Bibit Pisang
🌾 = *[ ${bibitanggur || 0} ]* Bibit Anggur
🌾 = *[ ${bibitmangga || 0} ]* Bibit Mangga
🌾 = *[ ${bibitjeruk || 0} ]* Bibit Jeruk
🌾 = *[ ${bibitapel || 0} ]* Bibit Apel    

*BIBIT SAYUR*
🌱 = *[ ${bibitwortel || 0} ]* Bibit Wortel
🌱 = *[ ${bibitkentang || 0} ]* Bibit Kentang
🌱 = *[ ${bibittomat || 0} ]* Bibit Tomat
🌱 = *[ ${bibitkubis || 0} ]* Bibit Kubis
🌱 = *[ ${bibitterong || 0} ]* Bibit Terong
🌱 = *[ ${bibitlabu || 0} ]* Bibit Labu

> Ketik: ${setting.prefix}sell item,count untuk menjual buah atau sayur.
> Contoh: ${setting.prefix}sell pisang 50`;

    const messageOptions = {
      text: gudangInfo,
      contextInfo: {
        externalAdReply: {
          title: '乂 G U D A N G',
          body: global.header,
          thumbnailUrl: 'https://files.catbox.moe/qvla2i.jpg',
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    };

    await erlic.sendMessage(m.chat, messageOptions, { quoted: m });
  },
  restrict: true,
  location: 'plugins/rpg/gudang.js'
};