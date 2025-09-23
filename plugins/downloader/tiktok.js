const fetch = require('node-fetch')

exports.run = {
  usage: ['tiktok2'],
  hidden: ['tt2'],
  use: 'link tiktok',
  category: 'downloader',
  async: async (m, { erlic, text, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}tiktok2 https://vt.tiktok.com/ZSF4cWcA2/`)
    if (!/tiktok\.com/i.test(text)) return m.reply(mess.error.url)

    erlic.sendReact(m.chat, '🕒', m.key)
    try {
      const res = await fetch(`https://api.vreden.my.id/api/v1/download/tiktok?url=${encodeURIComponent(text)}`)
      const data = await res.json()
      if (!data.status || !data.result) return m.reply(mess.error.api)

      let result = data.result
      let videoUrl = result.data.find(v => v.type === 'nowatermark_hd')?.url || result.data[0]?.url
      let caption = '乂  *TIKTOK - DOWNLOADER*\n'
      caption += `\n◦  *Title* : ${result.title}`
      caption += `\n◦  *Duration* : ${result.duration}`
      caption += `\n◦  *Region* : ${result.region}`
      caption += `\n◦  *Author* : ${result.author.nickname} (${result.author.fullname})`

      await erlic.sendMessage(m.chat, {
        video: { url: videoUrl },
        caption
      }, { quoted: m, ephemeralExpiration: m.expiration })
    } catch (e) {
      console.error(e)
      m.reply('Maaf terjadi kesalahan saat mengambil data.')
    }
  },
  limit: 5,
  location: "plugins/downloader/tiktok.js"
}