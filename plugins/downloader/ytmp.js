const fetch = require('node-fetch')

exports.run = {
  usage: ['ytmp3', 'ytmp4'],
  use: 'link YouTube',
  category: 'downloader',
  async: async (m, { erlic, text, command, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}${command} https://youtu.be/HWjCStB6k4o`)
    erlic.sendReact(m.chat, '🕒', m.key)

    try {
      let apiUrl
      if (command === 'ytmp3') {
        apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(text)}&quality=128`
      } else {
        apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/video?url=${encodeURIComponent(text)}&quality=360`
      }

      const res = await fetch(apiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      })
      const json = await res.json()

      if (!json.status || !json.result?.metadata || !json.result?.download?.url)
        return m.reply('❌ Gagal mendapatkan data. Pastikan link valid.')

      const meta = json.result.metadata
      const dl = json.result.download.url
      const img = meta.image || meta.thumbnail
      const cap = `乂 *Y O U T U B E - ${command.toUpperCase()}*\n
∘ *Judul* : ${meta.title}
∘ *Durasi* : ${meta.duration.timestamp || '-'}
∘ *Kualitas* : ${json.result.download.quality || '-'}
∘ *Views* : ${meta.views?.toLocaleString() || '-'}
∘ *Upload* : ${meta.ago || '-'}
∘ *Channel* : ${meta.author.name || '-'}
∘ *URL* : ${meta.url}
\n${meta.description?.substring(0, 150) || ''}\n\n_${command === 'ytmp3' ? 'Please wait, the audio file is being sent...':''}_`

      if (command === 'ytmp3') {
        let anjay = await erlic.sendMessage(m.chat, {
          image: { url: img },
          caption: cap,
          contextInfo: {
            externalAdReply: {
              title: meta.title,
              body: meta.author.name || '-',
              thumbnailUrl: img,
              sourceUrl: meta.url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m })

        await erlic.sendMessage(m.chat, {
          audio: { url: dl },
          mimetype: 'audio/mpeg',
          ptt: false
        }, { quoted: anjay })

      } else if (command === 'ytmp4') {
        await erlic.sendMessage(m.chat, {
          video: { url: dl },
          caption: cap,
          gifPlayback: false,
          contextInfo: {
            externalAdReply: {
              title: meta.title,
              body: meta.author.name || '-',
              thumbnailUrl: img,
              sourceUrl: meta.url,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m })
      }

    } catch (e) {
      console.error(e)
      if (e.type === 'invalid-json') {
        m.reply('⚠️ Server API tidak merespon JSON valid, coba lagi nanti.')
      } else {
        m.reply('❌ Terjadi kesalahan saat mengambil data.')
      }
    }
  },
  limit: 5,
  location: 'plugins/downloader/ytmp.js'
}