const cooldownFree = 2400000; // 40 menit untuk pengguna free
const cooldownPremium = 1200000; // 20 menit untuk pengguna premium

exports.run = {
  usage: ['adventure2'],
  hidden: ['adv2'],
  category: 'rpg',
  async: async (m, { erlic, func }) => {
    if (!global.db.users) global.db.users = {};
    if (!global.db.users[m.sender]) global.db.users[m.sender] = {};

    let user = global.db.users[m.sender];

    if (!user) {
      return erlic.sendMessage(
        m.chat,
        { text: 'User tidak ditemukan di database. Pastikan Anda sudah terdaftar!' },
        { quoted: m }
      );
    }

    if ((user.stamina || 0) < 50) {
      return erlic.sendMessage(
        m.chat,
        { text: `Stamina kamu kurang dari 50. Silakan isi stamina terlebih dahulu dengan command *${m.prefix}heal*.` },
        { quoted: m }
      );
    }

    const cooldown = user.premium ? cooldownPremium : cooldownFree;
    const lastAdventure = user.lastadventure2 || 0;
    const timeElapsed = Date.now() - lastAdventure;

    if (timeElapsed < cooldown) {
      const remainingTime = cooldown - timeElapsed;
      return erlic.sendMessage(
        m.chat,
        { text: `Misi luar angkasa masih dalam persiapan. Mohon tunggu *${func.msToTime(remainingTime)}* untuk *meluncur kembali*.` },
        { quoted: m }
      );
    }

    user.lastadventure2 = Date.now();
    user.stamina = (user.stamina || 0) - 5;

    await erlic.sendMessage(m.chat, { text: "_Memulai Misi Luar Angkasa..._" }, { quoted: m });

    setTimeout(() => {
      const minRange = user.premium ? 100 : 0;
      const maxRange = user.premium ? 5000 : 200;

      const rewards = {
        money: Math.floor(Math.random() * (12000 - 5000 + 1)) + 5000,
        exp: Math.floor(Math.random() * (9000 - 2000 + 1)) + 2000,
        meteorit: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
        crystal: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
        metal: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
        stardust: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
        alien_artifact: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
        moon_rock: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
        unknown_substance: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange
      };

      user.money = (user.money || 0) + rewards.money;
      user.exp = (user.exp || 0) + rewards.exp;
      user.meteorit = (user.meteorit || 0) + rewards.meteorit;
      user.crystal = (user.crystal || 0) + rewards.crystal;
      user.metal = (user.metal || 0) + rewards.metal;
      user.stardust = (user.stardust || 0) + rewards.stardust;
      user.alien_artifact = (user.alien_artifact || 0) + rewards.alien_artifact;
      user.moon_rock = (user.moon_rock || 0) + rewards.moon_rock;
      user.unknown_substance = (user.unknown_substance || 0) + rewards.unknown_substance;

      let rewardMessage = `乂 *RPG - SPACE ADVENTURE*\n\n` +
        `- Stamina: ${user.stamina || 0}/100\n` +
        `- EXP: ${rewards.exp}\n` +
        `- Money: $${rewards.money}\n\n` +
        `*Temuan di Luar Angkasa:*\n` +
        `- Meteorit: ${rewards.meteorit}\n` +
        `- Crystal: ${rewards.crystal}\n` +
        `- Metal: ${rewards.metal}\n` +
        `- Stardust: ${rewards.stardust}\n` +
        `- Alien Artifact: ${rewards.alien_artifact}\n` +
        `- Moon Rock: ${rewards.moon_rock}\n` +
        `- Unknown Substance: ${rewards.unknown_substance}`;

      erlic.sendMessage(m.chat, { text: rewardMessage }, { quoted: m });
    }, 10000);
  },
  restrict: true,
  limit: true,
  location: 'plugins/rpg/adventure2.js'
};