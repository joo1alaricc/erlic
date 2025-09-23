exports.run = {
usage: ['afk'],
category: 'group',
async: async (m, { func, erlic, users, text }) => {
if (text && text.length > 1000) return m.reply('Max 1000 character.')
users.afk = + new Date
users.alasan = text ? text : '';
users.afkObj = {
key: m.key,
message: m.message
}
return erlic.reply(m.chat, `${m.pushName} sedang AFK${text ? '\nAlasan: ' + text : ''}`, m)
},
group: true,
location: "plugins/group/afk.js"
}