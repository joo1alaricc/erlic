const fetch = require('node-fetch')

exports.run = {
  usage: ['instagram2'],
  hidden: ['ig2'],
  use: 'link instagram',
  category: 'downloader',
  async: async (m, { erlic, text, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}ig2 https://www.instagram.com/reel/C6AtQa1LEX0/`)
    if (!/instagram\.com/i.test(text)) return m.reply(mess.error.url)

    erlic.sendReact(m.chat, '🕒', m.key)
    try {
      const apiUrl = `https://api.vreden.my.id/api/v1/download/instagram?url=${encodeURIComponent(text)}`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status) return m.reply(mess.error.api)

      const result = json.result
      let caption = '乂  *INSTAGRAM - DOWNLOADER*\n'
      caption += `\n◦  *Username* : ${result.profile?.username || '-'}`
      caption += `\n◦  *Full Name* : ${result.profile?.full_name || '-'}`
      caption += `\n◦  *Likes* : ${result.statistics?.like_count || 0}`
      caption += `\n◦  *Comments* : ${result.statistics?.comment_count || 0}`
      caption += result.caption?.text ? `\n\n${result.caption.text}` : ''

      // kirim semua media (foto/video)
      for (let media of result.data) {
        if (media.type === 'video') {
          await erlic.sendMessage(m.chat, {
            video: { url: media.url },
            caption
          }, { quoted: m, ephemeralExpiration: m.expiration })
        } else if (media.type === 'image') {
          await erlic.sendMessage(m.chat, {
            image: { url: media.url },
            caption
          }, { quoted: m, ephemeralExpiration: m.expiration })
        }
      }

    } catch (e) {
      console.error(e)
      m.reply('Maaf terjadi kesalahan saat mengambil data.')
    }
  },
  limit: 5,
  location: "plugins/downloader/instagram2.js"
}