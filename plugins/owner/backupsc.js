const fs = require('fs')
const { execSync } = require('child_process')
const moment = require('moment-timezone')

exports.run = {
  usage: ['backupsc'],
  hidden: ['bksc', 'backupsource'],
  category: 'owner',
  async: async (m, { erlic }) => {
    await erlic.sendMessage(m.chat, { react: { text: "🕒", key: m.key } })

    try {
      // daftar folder/file yang ingin disertakan
      const ls = (await execSync("ls"))
        .toString()
        .split("\n")
        .filter(pe =>
          pe &&
          !["node_modules", "session", "tmp", "package-lock.json", "backup", "logs"].includes(pe)
        )

      const now = moment().tz("Asia/Jakarta").format("YYYY-MM-DD_HH-mm-ss")
      const zipName = `backup_${now}.zip`

      // buat zip file
      await execSync(`zip -r ${zipName} ${ls.join(" ")}`)

      // hitung ukuran file
      const fileSize = fs.statSync(`./${zipName}`).size
      const sizeFormatted = fileSize < 1024 * 1024
        ? `${(fileSize / 1024).toFixed(2)} KB`
        : `${(fileSize / (1024 * 1024)).toFixed(2)} MB`

      // caption file
      const caption = `Backup Source Code — ${global.botname || 'Bot'}\n\n` +
        `Ukuran: ${sizeFormatted}\nTanggal: ${moment().tz("Asia/Jakarta").format("dddd, DD MMMM YYYY HH:mm:ss")}`

      // gabungkan semua nomor owner
      const combined = [...(global.owner || [])]
      const uniqueJids = [...new Set(
        combined.map(num => num.replace(/[^0-9]/g, '') + "@s.whatsapp.net")
      )]

      // kirim file ke owner via private chat
      for (let jid of uniqueJids) {
        try {
          await erlic.sendMessage(jid, {
            document: fs.readFileSync(`./${zipName}`),
            caption,
            mimetype: "application/zip",
            fileName: zipName
          }, { quoted: m })
        } catch (err) {
          console.error(`Gagal kirim ke ${jid}:`, err.message)
        }
      }

      // hapus file setelah terkirim
      await execSync(`rm -rf ${zipName}`)

      // kirim konfirmasi hanya jika di grup
      if (m.isGroup) {
        await erlic.sendMessage(m.chat, {
          text: "File backup telah dikirim ke private chat."
        }, { quoted: m })
      }

    } catch (err) {
      console.error('Backup gagal:', err)
      await erlic.sendMessage(m.chat, {
        text: `Terjadi kesalahan saat membuat backup:\n${err.message}`
      }, { quoted: m })
    }
  },
  owner: true,
  location: "plugins/owner/backupsc.js"
}