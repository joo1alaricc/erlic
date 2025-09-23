const fetch = require('node-fetch')

exports.run = {
  usage: ['ayatrandom'],
  category: 'islamic',
  async: async (m, { erlic, setting }) => {
    erlic.sendReact(m.chat, '🕒', m.key)

    const apiUrl = 'https://cloudku.us.kg/api/murotal/random/ayat'
    const res = await fetch(apiUrl)
    const json = await res.json()

    if (!json.status || !json.result) return m.reply(mess.error.api)

    const info = json.result.info
    const ayat = json.result.ayat

    const surahId = info?.surat?.id || '-'
    const surahNameId = info?.surat?.nama?.id || '-'
    const surahNameAr = info?.surat?.nama?.ar || '-'
    const revelation = info?.surat?.relevasi || '-'
    const ayahNumber = ayat?.ayah || '-'
    const juz = ayat?.juz || '-'
    const page = ayat?.page || '-'
    const arab = ayat?.arab || '-'
    const latin = ayat?.latin || ''
    const translation = ayat?.text || '-'
    const audioUrl = ayat?.audio || null

    let caption = `乂  AYAT - RANDOM\n\n`
    caption += `- Surah : ${surahNameId} (${surahNameAr})\n`
    caption += `- Nomor : ${ayahNumber}\n`
    caption += `- Juz : ${juz}  -  Halaman : ${page}\n`
    caption += `- Asal : ${revelation}\n\n`
    caption += `${arab}\n\n`
    if (latin) caption += `Latin:\n${latin}\n\n`
    caption += `Terjemahan:\n${translation}`

    // kirim caption dulu
    const sentMsg = await erlic.sendMessage(m.chat, { text: caption }, { quoted: m })

    // kirim audio sebagai voice note (reply ke pesan teks) kalau tersedia
    if (audioUrl) {
      await erlic.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: 'audio/mpeg',
          ptt: true
        },
        { quoted: sentMsg }
      )
    }
  },
  limit: 5,
  location: 'plugins/islamic/ayatrandom.js'
}