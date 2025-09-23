const fetch = require('node-fetch')

exports.run = {
  usage: ['videy'],
  use: 'url',
  category: 'downloader',
  async: async (m, { erlic, text, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}videy https://videy.co/v/?id=jGe0bHj11`)

    erlic.sendReact(m.chat, '🕒', m.key)

    const apiUrl = `https://api.diioffc.web.id/api/download/videy?url=${encodeURIComponent(text)}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status) return m.reply(mess.error.api)

    const link = json.result?.link
    if (!link) return m.reply(mess.error.api)

    await erlic.sendMessage(m.chat, {
      video: { url: link },
      caption: global.mess.ok
    }, { quoted: m, ephemeralExpiration: m.expiration })
  },
  limit: 5,
  location: "plugins/downloader/videy.js"
}