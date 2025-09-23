const axios = require('axios');

function formatTime(ms) {
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((ms % (1000 * 60)) / 1000 / 60);
  const s = Math.floor((ms % (1000 * 60)) / 1000);
  return [
    d > 0 ? `${d} Hari` : '',
    h > 0 ? `${h} Jam` : '',
    m > 0 ? `${m} Menit` : '',
    s > 0 ? `${s} Detik` : '',
  ].filter(Boolean).join(', ');
}

exports.run = {
  usage: ['cooldown'],
  hidden: ['cd'],
  category: 'rpg',
  async: async (m, { erlic, setting, users }) => {
    if (!global.db.users) global.db.users = {};

    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) return 0;
          return target[prop];
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        }
      });
    }

    let user = global.db.users[m.sender];

    const cooldownGames = {
      'Unregister': user.lastunreg || 0,
      'Adventure': user.lastadventure || 0,
      'Adventure2': user.lastadventure2 || 0,
      'Adventure3': user.lastadventure3 || 0,
      'Airdrop': user.lastairdrop || 0,
      'Bansos': user.lastBansos || 0,
      'Berdagang': user.lastTrade || 0,
      'Berkebun': user.lastberkebun || 0,
      'Berburu': user.lastberburu || 0,
      'Chef': user.lastChef || 0,
      'Dokter': user.lastDokter || 0,
      'Guru': user.lastGuru || 0,
      'Kuli': user.lastKuli || 0,
      'Kurir': user.lastKurir || 0,
      'Mancing': user.lastmancing || 0,
      'Mining': user.lastmining || 0,
      'Montir': user.lastMontir || 0,
      'Mulung': user.lastmulung || 0,
      'Nebang': user.lastnebang || 0,
      'Nelayan': user.lastNelayan || 0,
      'Ngepet': user.lastNgepet || 0,
      'Ojek': user.lastOjek || 0,
      'Pemadam': user.lastPemadam || 0,
      'Petani': user.lastPetani || 0,
      'Polisi': user.lastPolisi || 0,
      'Rampok': user.lastRampok || 0,
      'Satpam': user.lastSatpam || 0,
      'Seniman': user.lastSeniman || 0,
      'Streaming': user.laststream || 0,
      'Taxi': user.lastTaxi || 0,
      'Tentara': user.lastTentara || 0,
      'Daily': user.lastdaily || 0,
      'Weekly': user.lastmingguan || 0,
      'Monthly': user.lastbulanan || 0,
      'Yearly': user.lastyearly || 0,
    };

    const now = Date.now();

    const cooldownTimes = {
      'Unregister': 86400000,
      'Adventure': user.premium ? 600000 : 1800000,
      'Adventure2': user.premium ? 1200000 : 2400000,
      'Adventure3': user.premium ? 1800000 : 3600000,
      'Airdrop': 172800000,
      'Bansos': 1800000,
      'Berdagang': user.premium ? 600000 : 1800000,
      'Berkebun': user.premium ? 600000 : 1800000,
      'Berburu': user.premium ? 600000 : 1800000,
      'Chef': user.premium ? 600000 : 1800000,
      'Dokter': user.premium ? 600000 : 1800000,
      'Guru': user.premium ? 600000 : 1800000,
      'Kuli': user.premium ? 600000 : 1800000,
      'Kurir': user.premium ? 600000 : 1800000,
      'Mancing': user.premium ? 600000 : 1800000,
      'Mining': user.premium ? 300000 : 600000,
      'Montir': user.premium ? 600000 : 1800000,
      'Mulung': user.premium ? 600000 : 1800000,
      'Nebang': user.premium ? 300000 : 600000,
      'Nelayan': user.premium ? 600000 : 1800000,
      'Ngepet': user.premium ? 300000 : 900000,
      'Ojek': user.premium ? 600000 : 1800000,
      'Pemadam': user.premium ? 600000 : 1800000,
      'Petani': user.premium ? 600000 : 1800000,
      'Polisi': user.premium ? 600000 : 1800000,
      'Rampok': 900000,
      'Satpam': user.premium ? 600000 : 1800000,
      'Seniman': user.premium ? 600000 : 1800000,
      'Streaming': 86400000,
      'Taxi': user.premium ? 600000 : 1800000,
      'Tentara': user.premium ? 600000 : 1800000,
      'Daily': 86400000,
      'Weekly': 604800000,
      'Monthly': 2592000000,
      'Yearly': 31536000000,
    };

    const cooldownStatus = Object.entries(cooldownGames)
      .map(([game, lastTime]) => {
        const cooldownDuration = cooldownTimes[game] || 0;
        const timeLeft = lastTime + cooldownDuration - now;
        return timeLeft <= 0
          ? `- ${game} = ✅`
          : `- ${game} = ❌ [${formatTime(timeLeft)}]`;
      })
      .join('\n');

    // Mengambil foto profil user jika ada
    let profilePicUrl = setting.cover;
    try {
      const profilePic = await erlic.profilePictureUrl(m.sender, 'image');
      if (profilePic) profilePicUrl = profilePic;
    } catch (e) {
      console.log('Gagal mengambil foto profil, menggunakan default cover.');
    }

    await erlic.sendMessage(m.chat, {
      text: cooldownStatus,
      contextInfo: {
        externalAdReply: {
          title: `COOLDOWN -  ${m.pushname?.toUpperCase() || users.name.toUpperCase() || m.sender.split('@')[0]}`,
          body: global.header,
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: profilePicUrl,
          sourceUrl: '',
        },
      },
    }, { quoted: m });
  },
  location: 'plugins/rpg/cooldown.js'
};