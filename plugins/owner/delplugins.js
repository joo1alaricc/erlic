const fs = require('fs');
const path = require('path');

exports.run = {
  usage: ['delplugin'],
  hidden: ['dp'],
  use: 'path',
  category: 'owner',
  async: async (m, { func, erlic, plugins, cmd, text }) => {
    if (!text) return m.reply(`Format salah!\nContoh : *${cmd} special/ping*`);
    try {
      let cek = fs.existsSync(path.join(process.cwd(), 'plugins', `${text}.js`))
      if (!cek) return m.reply(
        `Plugin '${text}' tidak ditemukan!\n\n${Object.keys(plugins).map(item => item?.replace('plugins/', '')).join('\n')}`
      );
      await fs.unlinkSync(path.join(process.cwd(), 'plugins', `${text}.js`));
      erlic.sendReact(m.chat, '✅', m.key)
    } catch (e) {
      erlic.sendReact(m.chat, '❌', m.key)
    }
  },
  owner: true
}