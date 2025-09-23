exports.run = {
    main: async (m, { func, erlic }) => {
        let afkUsers = [...new Set([
            ...(m.mentionedJid?.map(jid => jid.split('@')[0]) || []),
            ...(m.quoted ? [m.quoted.sender.split('@')[0]] : [])
        ])];

        for (let jid of afkUsers) {
            let fullJid = jid + '@s.whatsapp.net';
            let user = global.db.users[fullJid];
            if (!user) continue;
            let afkTime = user.afk;
            if (!afkTime || isNaN(afkTime)) continue;
            let reason = user.alasan || '';

            console.log(`AFK detected: ${fullJid}, reason: ${reason}`);

            erlic.reply(
                m.chat,
                `Jangan tag dia!\nDia sedang AFK ${reason ? 'dengan alasan ' + reason : ''}\nSelama *${func.clockString(Date.now() - afkTime)}*`,
                m
            );
        }
    },
    group: true,
    location: "plugins/event/_afkdetector.js"
}