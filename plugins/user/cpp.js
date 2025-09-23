exports.run = {
  usage: ['cpp'],
  hidden: ['cpk'],
  use: 'nama',
  category: 'user',
  async: async (m, { erlic, text, func, cmd }) => {
    if (!text) return erlic.sendMessage(m.chat, { text: func.example(cmd, 'nathn')}, { quoted: m})

    const penis = [
      "0 cm Buset panjang bet",
      "1 cm Buset pendek bet",
      "2 cm Buset pendek bet",
      "3 cm Buset pendek bet",
      "4 cm Buset pendek bet",
      "5 cm Hemm lumayan",
      "6 cm Hemm lumayan hm",
      "7 cm Heum terlalu panjang ya",
      "8 cm Aduh jangan ditanya",
      "9 cm Diluar nurul",
      "10 cm Aku nak pegang dong",
      "11 cm Bang?",
      "12 cm Auah panjang bet",
      "13 cm Ayo panjangin coli terus",
      "14 cm Gass",
      "15 cm Alamak",
    ]

    let wait = await erlic.sendMessage(
      m.chat,
      { text: `sedang mengukur penis...` },
      { quoted: m, ephemeralExpiration: m.expiration }
    )

    let hasil = penis[Math.floor(Math.random() * penis.length)]

    await erlic.sendMessage(
      m.chat,
      {
        text: `panjang penis ${text} adalah: ${hasil}`,
        edit: wait.key
      },
      { quoted: m, ephemeralExpiration: m.expiration }
    )
  },
  limit: true
}