const fetch = require('node-fetch')

exports.run = {
  usage: ['animagine'],
  use: 'prompt',
  category: 'ai',
  async: async (m, { erlic, text, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}animagine Magical floating islands in the sky with waterfalls`)

    erlic.sendReact(m.chat, '🕒', m.key)

    const apiUrl = `https://api.vreden.my.id/api/v1/artificial/animagine?prompt=${encodeURIComponent(text)}`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status) return m.reply(mess.error.api)

    const img = json.result?.image?.results
    if (!img) return m.reply(mess.error.api)

    await erlic.sendMessage(m.chat, {
      image: { url: img },
      caption: global.mess.ok
    }, { quoted: m, ephemeralExpiration: m.expiration })
  },
  limit: 5,
  location: "plugins/ai/animagine.js"
}