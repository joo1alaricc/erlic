const fetch = require('node-fetch')
const { createCanvas, loadImage } = require('canvas')

exports.run = {
  usage: ['play'],
  use: 'judul lagu',
  category: 'downloader',
  async: async (m, { erlic, text, setting }) => {
    if (!text) return m.reply(`Contoh: ${setting.prefix}play homesick`)
    erlic.sendReact(m.chat, '🕒', m.key)

    try {
      const res = await fetch(`https://api.vreden.my.id/api/v1/download/play/audio?query=${encodeURIComponent(text)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      })
      const json = await res.json()

      if (!json.status || !json.result?.metadata || !json.result?.download?.url)
        return m.reply('❌ Gagal menemukan lagu yang kamu cari.')

      const meta = json.result.metadata
      const dl = json.result.download.url
      const img = meta.image || meta.thumbnail

      // 🎨 Canvas tampilan "Now Playing"
      const canvas = createCanvas(800, 400)
      const ctx = canvas.getContext('2d')
      const thumb = await loadImage(img)

      const grad = ctx.createLinearGradient(0, 0, 0, 400)
      grad.addColorStop(0, '#121212')
      grad.addColorStop(1, '#1f1f1f')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.drawImage(thumb, 40, 80, 240, 240)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 28px Sans'

      let words = meta.title.split(' ')
      let line = '', y = 150
      for (let w of words) {
        if (ctx.measureText(line + w).width > 400) {
          ctx.fillText(line.trim(), 310, y)
          line = ''
          y += 32
        }
        line += w + ' '
      }
      ctx.fillText(line.trim(), 310, y)

      ctx.fillStyle = '#b3b3b3'
      ctx.font = '22px Sans'
      ctx.fillText(meta.author.name || '-', 310, y + 40)
      ctx.fillText(meta.duration.timestamp || '-', 310, y + 70)

      ctx.fillStyle = '#555'
      ctx.fillRect(310, y + 100, 400, 6)
      ctx.fillStyle = '#1db954'
      ctx.fillRect(310, y + 100, 180, 6)

      const buffer = canvas.toBuffer('image/png')
      const cap = `乂 *Y O U T U B E - P L A Y*\n
∘ *Title* : ${meta.title}
∘ *Duration* : ${meta.duration.timestamp || '-'}
∘ *Views* : ${meta.views?.toLocaleString() || '-'}
∘ *Upload* : ${meta.ago || '-'}
∘ *Author* : ${meta.author.name || '-'}
∘ *URL* : ${meta.url}
∘ *Description* : ${meta.description?.substring(0, 150) || '-'}...
\nPlease wait, the audio file is being sent...`

      const msg = await erlic.sendMessage(m.chat, {
        image: buffer,
        caption: cap,
        contextInfo: {
          externalAdReply: {
            title: meta.title,
            body: meta.author.name || '-',
            thumbnailUrl: img,
            sourceUrl: meta.url,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: false
          }
        }
      }, { quoted: m })

      // 🎧 Kirim audio
      await erlic.sendMessage(m.chat, {
        audio: { url: dl },
        mimetype: 'audio/mpeg',
        ptt: false
      }, { quoted: msg })

    } catch (e) {
      console.error(e)
      if (e.type === 'invalid-json') {
        m.reply('⚠️ Server API sedang tidak merespon JSON valid. Coba lagi nanti.')
      } else {
        m.reply('❌ Terjadi kesalahan saat mengambil data audio.')
      }
    }
  },
  limit: 5,
  location: 'plugins/downloader/play.js'
}