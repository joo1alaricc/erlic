const fs = require('fs');
const path = require('path');

exports.run = {
  usage: ['saveplugin','addplugin'],
  hidden: ['sp'], 
  use: 'reply code',
  category: 'owner',
  async: async (m, { func, erlic, quoted, text, cmd }) => {
    if (!quoted) return m.reply(`Mau simpan plugin dengan command apa? reply teks script nya!`);
    try {
      let data;
      if (/application\/javascript/.test(quoted.mime)) {
        data = await quoted.download();
      } else {
        data = quoted.text;
      }

      // cari location di script
      let locationMatch = data.match(/location\s*:\s*['"`](.+?)['"`]/);
      let savePath;
      if (locationMatch && locationMatch[1]) {
        savePath = path.join(process.cwd(), locationMatch[1]);
      } else if (text) {
        savePath = path.join(process.cwd(), 'plugins', `${text}.js`);
      } else {
        return m.reply('Tidak ada lokasi plugin yang ditemukan di script, dan kamu juga tidak menulis path.');
      }

      // pastikan folder ada
      let dir = path.dirname(savePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      await fs.writeFileSync(savePath, data);
      erlic.sendReact(m.chat, '✅', m.key);
    } catch (e) {
      console.error(e);
      erlic.sendReact(m.chat, '❌', m.key);
    }
  },
  owner: true
};