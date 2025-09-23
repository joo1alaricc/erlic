function formatMoney(amount) {
  return '$' + (amount || 0).toLocaleString('id-ID'); 
}

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

exports.run = {
  usage: ['bansos'],
  category: 'rpg',
  async: async (m, { erlic, users }) => {
    if (!global.db.users) global.db.users = {};
    
    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) {
            if (prop === 'balance') target[prop] = 0;
            else if (prop === 'lastBansos') target[prop] = 0;
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

    let user = global.db.users[m.sender];

    // Cek cooldown
    const lastBansosTime = user.lastBansos || 0;
    const cooldownTime = 30 * 60 * 1000;
    const currentTime = Date.now();

    if (currentTime - lastBansosTime < cooldownTime) {
      const timeLeft = cooldownTime - (currentTime - lastBansosTime);
      const formattedTime = formatTime(timeLeft);
      return erlic.sendMessage(m.chat, { text: `Kamu sudah korupsi Bansos, mohon tunggu ${formattedTime} untuk korupsi Bansos kembali.` }, { quoted: m });
    }

    const isSuccess = Math.random() > 0.5;

    if (isSuccess) {
      const amount = Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000;
      user.balance += amount;
      user.lastBansos = currentTime;

      let teks = `乂 *RPG BANSOS*\n\nKamu berhasil korupsi Dana bansos sebanyak *${formatMoney(amount)}* balance.`;

      return erlic.sendMessage(
        m.chat,
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              title: 'Kamu Berhasil!',
              body: `Dana bansos berhasil dikorupsi!`,
              mediaType: 2,
              thumbnailUrl: 'https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg',
            },
          },
        },
        { quoted: m }
      );
    } else {
      const loss = Math.floor(Math.random() * (250000 - 50000 + 1)) + 50000;
      user.balance -= loss;
      user.lastBansos = currentTime;

      let teks = `乂 *RPG BANSOS*\n\nKamu gagal korupsi Dana bansos dan kamu rugi sebanyak *${formatMoney(loss)}* balance.`;

      return erlic.sendMessage(
        m.chat,
        {
          text: teks,
          contextInfo: {
            externalAdReply: {
              title: 'Kamu Gagal!',
              body: `Dana bansos gagal dikorupsi!`,
              mediaType: 2,
              thumbnailUrl: 'https://telegra.ph/file/afcf9a7f4e713591080b5.jpg',
            },
          },
        },
        { quoted: m }
      );
    }
  },
  limit: true,
  restrict: true,
  location: 'plugins/rpg/bansos.js'
};