function formatCooldown(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
  return num < 10 ? '0' + num : num;
}

exports.run = {
  usage: ['berkebun'],
  hidden: ['farm'],
  category: 'rpg',
  async: async (m, { erlic, users, setting }) => {
    if (!global.db.users) global.db.users = {};

    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) {
            if (prop.startsWith('bibit')) target[prop] = 0;
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

    const bibitList = [
      { name: 'apel', count: sender.bibitapel },
      { name: 'anggur', count: sender.bibitanggur },
      { name: 'mangga', count: sender.bibitmangga },
      { name: 'jeruk', count: sender.bibitjeruk },
      { name: 'pisang', count: sender.bibitpisang },
      { name: 'wortel', count: sender.bibitwortel },
      { name: 'kentang', count: sender.bibitkentang },
      { name: 'tomat', count: sender.bibittomat },
      { name: 'kubis', count: sender.bibitkubis },
      { name: 'terong', count: sender.bibitterong },
      { name: 'labu', count: sender.bibitlabu }
    ];

    let kurangMessage = 'Bibit kamu tidak mencukupi untuk berkebun:\n';
    let allSufficient = true;
    for (let bibit of bibitList) {
      if (bibit.count < 1) { 
        kurangMessage += `- Bibit ${bibit.name}: ${bibit.count}\n`;
        allSufficient = false;
      }
    }

    if (!allSufficient) {
      return erlic.sendMessage(m.chat, {
        text: `${kurangMessage}\n> Ketik ${m.prefix}buybibit untuk membeli bibit.`,
        contextInfo: { mentionedJid: [m.sender] }  
      }, { quoted: m });
    }

    const cooldown = 30 * 60 * 1000; // 30 menit cooldown
    if (Date.now() - sender.lastberkebun < cooldown) {
      return erlic.sendMessage(m.chat, {
        text: `Kamu sudah berkebun, mohon tunggu *${formatCooldown(cooldown - (Date.now() - sender.lastberkebun))}* untuk bisa *berkebun* lagi.`,
        contextInfo: { mentionedJid: [m.sender] } 
      }, { quoted: m });
    }

    const hadiahExp = Math.floor(Math.random() * 991) + 10; 
    const hasilBerkebun = {
      apel: Math.floor(Math.random() * 501),
      anggur: Math.floor(Math.random() * 501),
      mangga: Math.floor(Math.random() * 501),
      jeruk: Math.floor(Math.random() * 501),
      pisang: Math.floor(Math.random() * 501),
      wortel: Math.floor(Math.random() * 501),
      kentang: Math.floor(Math.random() * 501),
      tomat: Math.floor(Math.random() * 501),
      kubis: Math.floor(Math.random() * 501),
      terong: Math.floor(Math.random() * 501),
      labu: Math.floor(Math.random() * 501)
    };

    sender.lastberkebun = Date.now();

    sender.bibitapel -= 100;
    sender.bibitanggur -= 100;
    sender.bibitpisang -= 100;
    sender.bibitmangga -= 100;
    sender.bibitjeruk -= 100;
    sender.bibitwortel -= 100;
    sender.bibitkentang -= 100;
    sender.bibittomat -= 100;
    sender.bibitkubis -= 100;
    sender.bibitterong -= 100;
    sender.bibitlabu -= 100;

    sender.apel += hasilBerkebun.apel;
    sender.anggur += hasilBerkebun.anggur;
    sender.mangga += hasilBerkebun.mangga;
    sender.jeruk += hasilBerkebun.jeruk;
    sender.pisang += hasilBerkebun.pisang;
    sender.wortel += hasilBerkebun.wortel;
    sender.kentang += hasilBerkebun.kentang;
    sender.tomat += hasilBerkebun.tomat;
    sender.kubis += hasilBerkebun.kubis;
    sender.terong += hasilBerkebun.terong;
    sender.labu += hasilBerkebun.labu;

    sender.stamina -= 10;

    return erlic.sendMessage(m.chat, {
      text: `乂 *RPG BERKEBUN*\n\nSisa Stamina: ${sender.stamina} / 100\nExp: +${hadiahExp}\n\n🍎 Apel: +${hasilBerkebun.apel}\n🥭 Mangga: +${hasilBerkebun.mangga}\n🍊 Jeruk: +${hasilBerkebun.jeruk}\n🍌 Pisang: +${hasilBerkebun.pisang}\n🍇 Anggur: +${hasilBerkebun.anggur}\n\n🥕 Wortel: +${hasilBerkebun.wortel}\n🥔 Kentang: +${hasilBerkebun.kentang}\n🍅 Tomat: +${hasilBerkebun.tomat}\n🥬 Kubis: +${hasilBerkebun.kubis}\n🍆 Terong: +${hasilBerkebun.terong}\n🎃 Labu: +${hasilBerkebun.labu}\n\n> Ketik ${setting.prefix}gudang untuk melihat hasil panenmu.`,
      contextInfo: {
        externalAdReply: {
          title: 'B E R K E B U N',
          body: global.header,
          thumbnailUrl: 'https://files.catbox.moe/daujyf.jpg',
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  },
  limit: true,
  group: false,
  location: 'plugins/rpg/berkebun.js'
};