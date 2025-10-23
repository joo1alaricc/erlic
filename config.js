/* Base by: Siputzx Production 
   Creator: Jovian 
   Note: owner bisa lebih dari 1, tambahkan sesuai kebutuhan
   Note: Sistem akan update secara otomatis ke versi yang terbaru, jangan lupa untuk rutin membackup kode bot agar fitur di erlic.js bisa dipulihkan kembali. (Update meliputi: erlic.js, ./database/menu.json). Untuk info lebih lanjut, ikuti saluran erlic official: https://whatsapp.com/channel/0029VarSnzo2v1IjuQu2BC3v
*/

/* setting informasi bot */
// ganti nomor bot lu
global.config = {
    botnumber: '6287748800395',
    pairing: true,
    session: 'session',
    online: true,
    version: [2, 3000, 1015901307],
    browser: ['Windows', 'Chrome', '20.0.04']
}
// ganti nomor lu
global.owner = ['6283878301449']
// ganti nama lu
global.ownername = ['jovian']
// website owner
global.website = ['https://instagram.com/arxhillie','https://instagram.com/arxhillie']
// fake lokasi owner
global.lokasi = ['Manila, Philippines','Indonesia']
// email owner 
global.email = ['jovianemanuel264@gmail.com','dimzy@gmail.com']
// ini owner tambahan
global.prems = ['6283878301449']
// nama bot lu
global.botname = 'erlic'
// watermark di beberapa fitur
global.header = `© erlic-bot v${require('./package.json').version}` 
// watermark
global.footer = 'ꜱɪᴍᴘʟᴇ ʙᴏᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ᴍᴀᴅᴇ ʙʏ ɴᴀᴛʜᴀɴ' 
// packname stiker lu
global.packname = `Created by Erlic Bot\n\n+week, +date\n+time`
// author stiker lu
global.author = '' 
// link di beberapa fitur
global.link = '' 
// watermark di beberapa fitur
global.wm = 'Powered by ' + global.botname
// id saluran lu
global.idSaluran = '120363420653488907@newsletter' 
// id grup lu
global.idgc = '120363385221000216@g.us'
// sound di menu, bisa 1 atau lebih
global.sound = ['https://files.catbox.moe/g1pp69.mpeg', 'https://files.catbox.moe/19k9d1.mpeg', 'https://files.catbox.moe/lgd9tm.mpeg', 'https://files.catbox.moe/s12ar1.m4a']
// thumbnail di beberapa fitur
global.thumb = 'https://files.catbox.moe/gu0oe4.jpeg' 

/* setting system bot */
// font untuk di menu (1-39)
global.font = 38
// cooldown perdetik untuk jpm
global.delayJpm = 5
global.autoread = true
global.autobio = false
global.online = true
global.autotyping = true
global.autorecord = false
global.antispam = true
// setting cooldown anti spam
global.cooldown = 2
global.gconly = true

/* setting payment */
// url qris lu
global.qris = 'https://files.catbox.moe/1z91ic.jpeg' 
// sesuai nama qris di global.qris
global.payment = 'QRIS'
// sesuai nomor e-money lu
global.ovo = 6282245682288
global.dana = ''
global.shopeepay = ''
global.gopay = 6282245682288
global.seabank = ''
global.pulsa = 6282245682288
global.pulsa2 = ''

/* setting cpanel */
// domain panel lu
global.domain = 'https://panel-denzbackera.speedhost.biz.id' 
// token ptla lu
global.apikey = 'ptla_0Ps7A50sOlwIYYxblrLpLVhC2WThVHQNXzu1S4r0mWK'
// token ptlc lu
global.capikey = 'ptlc_ciP6Hnwi8pRqlGYlr1187pgCskFPWKlm3EqpFWHI04C'
global.egg = '15' /* Recommended */
global.loc = '1' /* Recommended */

/* setting message */
global.mess = {
wait: 'Processed . . .',
ok: 'Successfully.',
limit: 'Anda mencapai limit dan akan disetel ulang pada pukul 00.00\n\nUntuk mendapatkan limit unlimited, tingkatkan ke paket premium.',
premium: 'This feature only for premium user.',
jadibot: 'This feature only for jadibot user.',
owner: 'This feature is only for owners.',
gconly: 'Menggunakan bot di obrolan pribadi hanya untuk pengguna premium, tingkatkan ke paket premium hanya Rp10.000 selama 1 bulan.\n\nhttps://chat.whatsapp.com/GcJpxrGy2IYA1E7sYgpMz9\nBergabung kedalam grup kami agar dapat menggunakan bot di obrolan pribadi.',
blockcmd: 'This feature is being blocked by system because an error occurred.',
group: 'This feature will only work in groups.',
private: 'Use this feature in private chat.',
admin: 'This feature only for group admin.',
botAdmin: 'This feature will work when I become an admin',
devs: 'This feature is only for developer.',
errorstc: 'Failed to create sticker.',
error: 'Sorry an error occurred!',
errorUrl: 'URL is invalid!'
}

require('./system/functions.js').reloadFile(__filename);
