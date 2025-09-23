const fetch = require('node-fetch')

exports.run = {
  usage: ['tiktok3'],
  hidden: ['tt3'],
  use: 'link tiktok',
  category: 'downloader',
  async: async (m, { erlic, text, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}tiktok3 https://vt.tiktok.com/ZSjXNEnbC/`)
    if (!/tiktok\.com/i.test(text)) return m.reply(mess.error.url)

    erlic.sendReact(m.chat, '🕒', m.key)
    try {
      const apiUrl = `https://www.apis-anomaki.zone.id/downloader/tiktokdl?url=${encodeURIComponent(text)}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status) return m.reply(mess.error.api)

      const result = json.result
      const video = result.video?.url

      let caption = '乂  *TIKTOK - DOWNLOADER*\n'
      caption += `\n◦  *Creator* : ${json.creator || '-'}`
      caption += `\n◦  *Resolution* : ${result.video?.width || ''}x${result.video?.height || ''}`

      // kirim video no-WM
      await erlic.sendMessage(m.chat, {
        video: { url: video },
        caption
      }, { quoted: m, ephemeralExpiration: m.expiration })

    } catch (e) {
      console.error(e)
      m.reply('Maaf terjadi kesalahan saat mengambil data.')
    }
  },
  limit: 5,
  location: "plugins/downloader/tiktok3.js"
}