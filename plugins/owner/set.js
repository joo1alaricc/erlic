const fs = require('fs')
const path = require('path')

exports.run = {
  usage: ['set'],
  use: 'option|value',
  category: 'owner',
  async: async (m, { erlic, text, command, func }) => {
    if (!text) return erlic.reply(m.chat, func.example(command, 'config.botnumber|6281234567890'), m)

    const [key, value] = text.split('|').map(v => v?.trim())
    if (!key || !value) return erlic.reply(m.chat, func.example(command, 'config.botnumber|6281234567890'), m)

    const configPath = path.join(process.cwd(), 'config.js')
    if (!fs.existsSync(configPath)) return erlic.reply(m.chat, 'File config.js tidak ditemukan.', m)

    try {
      let content = fs.readFileSync(configPath, 'utf8')

      // deteksi apakah target dari global.config atau global langsung
      const isConfigObj = key.startsWith('config.')
      const targetKey = isConfigObj ? key.split('.')[1] : key

      // regex untuk objek global.config = { ... }
      const configRegex = new RegExp(`(${targetKey}\\s*:\\s*)([^,\\n]*)`, 'i')
      // regex untuk global.<key> =
      const globalRegex = new RegExp(`global\\.${targetKey}\\s*=\\s*([^\\n;]*)`, 'i')

      // tentukan apakah ada di config.js
      const match = content.match(configRegex) || content.match(globalRegex)
      if (!match) {
        // daftar semua key di dalam global.config
        const available = [
          ...content.matchAll(/(\bconfig\.\w+)\s*[:=]/g)
        ].map(x => x[1]).join(', ')
        return erlic.reply(
          m.chat,
          `Variabel ${key} tidak ditemukan di config.js\n\nDaftar yang tersedia:\n${available || '-tidak ada-'}`,
          m
        )
      }

      // tentukan format nilai baru
      let newValue
      if (value.includes(',')) {
        const arr = value.split(',').map(v => v.trim())
        const formatted = arr.map(a => (isNaN(a) ? `"${a}"` : a))
        newValue = `[${formatted.join(', ')}]`
      } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        newValue = value.toLowerCase()
      } else if (!isNaN(value)) {
        newValue = value
      } else {
        newValue = `"${value}"`
      }

      // replace sesuai jenis key
      if (content.match(configRegex)) {
        content = content.replace(configRegex, `$1${newValue}`)
      } else {
        content = content.replace(globalRegex, `global.${targetKey} = ${newValue}`)
      }

      // tulis ulang dengan newline rapi
      fs.writeFileSync(configPath, content.replace(/\n{2,}/g, '\n\n'), 'utf8')

      // reload otomatis tanpa restart
      delete require.cache[require.resolve(configPath)]
      require(configPath)

      erlic.reply(m.chat, `Berhasil ubah ${key} menjadi ${newValue}`, m)
    } catch (err) {
      console.error(err)
      erlic.reply(m.chat, `Gagal mengubah konfigurasi: ${err.message}`, m)
    }
  },
  owner: true,
  location: 'plugins/owner/set.js'
}