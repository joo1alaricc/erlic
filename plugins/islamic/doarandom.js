const fetch = require('node-fetch')

function splitText(text, maxLength) {
  let result = []
  let current = ""
  const words = text.split(" ")
  for (let word of words) {
    if ((current + word).length <= maxLength) {
      current += word + " "
    } else {
      result.push(current.trim())
      current = word + " "
    }
  }
  if (current.trim()) result.push(current.trim())
  return result
}

exports.run = {
  usage: ['doarandom'],
  category: 'islamic',
  async: async (m, { erlic }) => {
    erlic.sendReact(m.chat, '🕒', m.key)

    const apiUrl = `https://cloudku.us.kg/api/murotal/random/doa`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.result) return m.reply(mess.error.api)

    const found = json.result
    let caption = `乂  D O A  -  ${found.source?.toUpperCase() || "HARIAN"}\n\n`
    caption += `${found.judul}\n\n`
    caption += `${found.arab}\n\n`
    if (found.latin) caption += `Latin:\n${found.latin}\n\n`
    caption += `Terjemahan:\n${found.indo}`

    // kirim caption dulu
    let sentMsg = await erlic.sendMessage(m.chat, { text: caption }, { quoted: m })

    // proses arabic jadi vn
    if (found.arab) {
      let potongan = splitText(found.arab, 200)
      for (let i = 0; i < potongan.length; i++) {
        let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(potongan[i])}&tl=ar&client=tw-ob`
        await erlic.sendMessage(m.chat, {
          audio: { url },
          mimetype: 'audio/mp4',
          ptt: true
        }, { quoted: sentMsg })
      }
    }
  },
  limit: 5,
  location: "plugins/islamic/doarandom.js"
}