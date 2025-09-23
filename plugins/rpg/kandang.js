exports.run = {
  usage: ['kandang'],
  category: 'rpg',
  async: async (m, { func, erlic, users, setting, froms }) => {
    const user = global.db.users[m.sender];
    const { banteng, harimau, gajah, kambing, panda, buaya, kerbau, sapi, monyet, babi, babihutan, ayam } = user;

    const ndy = `- 🐂 = *[ ${banteng} ]* Ekor Banteng
- 🐅 = *[ ${harimau} ]* Ekor Harimau
-  🐘 = *[ ${gajah} ]* Ekor Gajah
- 🐐 = *[ ${kambing} ]* Ekor Kambing
- 🐼 = *[ ${panda} ]* Ekor Panda
- 🐊 = *[ ${buaya} ]* Ekor Buaya
- 🐃 = *[ ${kerbau} ]* Ekor Kerbau
- 🐮 = *[ ${sapi} ]* Ekor Sapi
- 🐒 = *[ ${monyet} ]* Ekor Monyet
- 🐗 = *[ ${babihutan} ]* Ekor Babi Hutan
- 🐖 = *[ ${babi} ]* Ekor Babi
- 🐓 = *[ ${ayam} ]* Ekor Ayam`;

    erlic.sendMessage(
      m.chat,
      {
        text: ndy,
        contextInfo: {
          externalAdReply: {
            title: '乂 K A N D A N G',
            body: global.header,
            mediaType: 1,
            renderLargeThumbnail: true,
            thumbnailUrl: 'https://files.catbox.moe/ptbfe4.jpg'
          }
        }
      },
      { quoted: m }
    );
  },
  restrict: true,
location: 'plugins/rpg/kandang.js'
};