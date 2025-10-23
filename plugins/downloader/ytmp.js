const fetch = require('node-fetch')

exports.run = {
  usage: ['ytmp3', 'ytmp4'],
  use: 'link YouTube',
  category: 'downloader',
  async: async (m, { erlic, text, command, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}${command} https://youtu.be/V4L882gVqTg`)
    await erlic.sendMessage(m.chat, { react: { text: "🕒", key: m.key } })

    try {
      const format = command === 'ytmp3' ? 'mp3' : 'mp4'
      const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/v1?url=${encodeURIComponent(text)}&format=${format}`

      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.success || !json.result?.downloadUrl)
        return m.reply('Gagal mendapatkan data. Pastikan link valid atau coba format lain.')

      const r = json.result
      const thumb = r.cover
      const caption = `乂 *Y O U T U B E - ${format.toUpperCase()}*\n
∘ *Title* : ${r.title}
∘ *Duration* : ${r.duration || '-'}
∘ *Quality* : ${r.quality || '-'}
∘ *Format* : ${r.format?.toUpperCase() || '-'}
\n${command === 'ytmp3' ? '_Audio file is being sent..._' : ''}`

      if (command === 'ytmp3') {
        // kirim thumbnail preview dulu
        const preview = await erlic.sendMessage(m.chat, {
          image: { url: thumb },
          caption,
          contextInfo: {
            externalAdReply: {
              title: r.title,
              body: 'YouTube Downloader',
              thumbnailUrl: thumb,
              sourceUrl: text,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m })

        // lalu kirim audio
        await erlic.sendMessage(m.chat, {
          audio: { url: r.downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: `${r.title}.mp3`,
          ptt: false
        }, { quoted: preview })

      } else {
        // langsung kirim video tanpa preview thumbnail
        await erlic.sendMessage(m.chat, {
          video: { url: r.downloadUrl },
          caption: `乂 *Y O U T U B E - MP4*\n
∘ *Judul* : ${r.title}
∘ *Durasi* : ${r.duration || '-'}
∘ *Kualitas* : ${r.quality || '-'}
∘ *Format* : ${r.format?.toUpperCase() || '-'}`
        }, { quoted: m })
      }

    } catch (err) {
      console.error(err)
      m.reply('Terjadi kesalahan saat mengambil data. Coba lagi nanti.')
    }
  },
  limit: 5,
  location: 'plugins/downloader/ytmp.js'
}