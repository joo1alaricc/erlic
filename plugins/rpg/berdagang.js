function formatMoney(amount) {
  return '$' + (amount || 0).toLocaleString('id-ID');
}

function formatCooldown(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

const cooldown = 1800000; // 30 menit dalam milidetik

exports.run = {
  usage: ['berdagang'],
  hidden: ['trade'],
  use: 'mention or reply',
  category: 'rpg',
  async: async (m, { erlic, users }) => {
    if (!global.db.users) global.db.users = {};

    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) {
            if (prop === 'balance') target[prop] = 0;
            else if (prop === 'lastTrade') target[prop] = 0;
            else target[prop] = 0;
          }
          return target[prop];
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        }
      });
    }

    let sender = global.db.users[m.sender];

    let who = m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : (m.quoted && m.quoted.sender ? m.quoted.sender : null);

    if (!who) {
      return erlic.sendMessage(m.chat, { 
        text: `Mention atau reply seseorang untuk Berdagang`, 
        contextInfo: { mentionedJid: [m.sender] } 
      }, { quoted: m });
    }

    if (!global.db.users[who]) {
      global.db.users[who] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) {
            if (prop === 'balance') target[prop] = 0;
            else if (prop === 'lastTrade') target[prop] = 0;
            else target[prop] = 0;
          }
          return target[prop];
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        }
      });
    }

    let targetUser = global.db.users[who];

    if (sender.balance < 10000) {
      return erlic.sendMessage(m.chat, { 
        text: `Balance kamu tidak mencukupi untuk berdagang.\nMinimal balance adalah $10.000.\n> Balance kamu: ${formatMoney(sender.balance)}`, 
        contextInfo: { mentionedJid: [m.sender] }
      }, { quoted: m });
    }

    if (targetUser.balance < 10000) {
      return erlic.sendMessage(m.chat, { 
        text: `Balance @${who.split('@')[0]} tidak mencukupi untuk berdagang.\nMinimal balance adalah $10.000.\n> Balance @${who.split('@')[0]}: ${formatMoney(targetUser.balance)}`, 
        contextInfo: { mentionedJid: [who] }
      }, { quoted: m });
    }

    if (Date.now() - sender.lastTrade < cooldown) {
      return erlic.sendMessage(m.chat, { 
        text: `Kamu sudah berdagang, mohon tunggu *${formatCooldown(cooldown - (Date.now() - sender.lastTrade))}* untuk bisa *berdagang* lagi.`,
        contextInfo: { mentionedJid: [m.sender] }
      }, { quoted: m });
    }

    sender.lastTrade = Date.now();

    const tradeItems = ['Ikan', 'Sayur mayur', 'Buah buahan', 'Snack', 'Minuman'];
    const randomItem = tradeItems[Math.floor(Math.random() * tradeItems.length)];
    const totalMoney = Math.floor(Math.random() * (50000 - 25000 + 1)) + 25000;
    const totalMoneyDoubled = totalMoney * 2;

    sender.balance -= 10000;
    targetUser.balance -= 10000;

    await erlic.sendMessage(m.chat, { 
      text: `乂 *RPG BERDAGANG*\n\n@${m.sender.split('@')[0]} dan @${who.split('@')[0]} sedang berdagang...`,
      contextInfo: { mentionedJid: [m.sender, who] } 
    }, { quoted: m });

    await new Promise(resolve => setTimeout(resolve, 20000));

    sender.balance += totalMoneyDoubled;
    targetUser.balance += totalMoneyDoubled;

    return erlic.sendMessage(m.chat, { 
      text: `乂 *RPG BERDAGANG*\n\n@${m.sender.split('@')[0]} dan @${who.split('@')[0]} berhasil berdagang ${randomItem}!\n\nKalian mendapatkan balance sebanyak: ${formatMoney(totalMoneyDoubled)}`,
      contextInfo: { mentionedJid: [m.sender, who] }
    }, { quoted: m });
  },
  limit: true,
  group: true,
  location: 'plugins/rpg/berdagang.js'
};