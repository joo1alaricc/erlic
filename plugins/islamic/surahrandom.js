const fetch = require('node-fetch')

exports.run = {
  usage: ['surahrandom'],
  category: 'islamic',
  async: async (m, { erlic }) => {
    erlic.sendReact(m.chat, '🕒', m.key)

    const apiUrl = `https://cloudku.us.kg/api/murotal/random/surah`
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.result) return m.reply(mess.error.api)

    const found = json.result
    let caption = `乂  S U R A H  -  R A N D O M\n\n`
    caption += `${found.name_long} (${found.name_id})\n`
    caption += `Surah ke-${found.number} | ${found.number_of_verses} ayat\n`
    caption += `Asal: ${found.revelation_id} (${found.revelation_en})\n\n`
    caption += `Arti: ${found.translation_id} (${found.translation_en})\n\n`
    caption += `Tafsir:\n${found.tafsir}`

    // kirim caption dulu
    let sentMsg = await erlic.sendMessage(m.chat, { text: caption }, { quoted: m })

    // kirim audio murotal
    if (found.audio_url) {
      await erlic.sendMessage(m.chat, {
        audio: { url: found.audio_url },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: sentMsg })
    }
  },
  limit: 5,
  location: "plugins/islamic/surahrandom.js"
}