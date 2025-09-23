const path = require('path');
const fs = require('fs');

// fungsi ambil list plugin (rekursif folder + urut A-Z, output pakai .js)
function getPluginList(dir = path.join(process.cwd(), 'plugins')) {
  let result = []
  let files = fs.readdirSync(dir)
  for (let file of files) {
    let filepath = path.join(dir, file)
    if (fs.lstatSync(filepath).isDirectory()) {
      result = result.concat(getPluginList(filepath))
    } else if (file.endsWith('.js')) {
      result.push(path.relative(path.join(process.cwd(), 'plugins'), filepath).replace(/\\/g, '/'))
    }
  }
  return result.sort((a, b) => a.localeCompare(b))
}

exports.run = {
  usage: ['getplugin'],
  hidden: ['gp'],
  use: 'path',
  category: 'owner',
  async: async (m, { func, erlic, cmd, text }) => {
    try {
      if (!text) return m.reply(`Format salah!\nContoh : *${cmd} user/cpp*`);
      
      // tambahkan .js saat baca file
      let pluginPath = path.join(process.cwd(), 'plugins', text + '.js')
      let plugin = fs.readFileSync(pluginPath, 'utf-8')
      
      erlic.sendMessage(m.chat, { text: plugin }, { quoted: m, ephemeralExpiration: m.expiration })
    } catch (e) {
      // output list pakai .js
      let list = getPluginList().map(v => `◦ ${v}`).join('\n') || 'Belum ada plugin.'
      m.reply(`Plugin '${text}' tidak ditemukan!\n\n${list}`)
    }
  },
  owner: true
}