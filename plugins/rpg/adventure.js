const cooldownFree = 1800000;
const cooldownPremium = 600000;

exports.run = {
  usage: ['adventure'],
  hidden: ['adv'],
  category: 'rpg',
  async: async (m, { func, erlic }) => {

    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) {
            if (prop === 'stamina') target[prop] = 100;
            else if (prop === 'premium') target[prop] = false;
            else if (prop === 'lastadventure') target[prop] = 0;
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

    if (user.stamina < 20) {
      return erlic.sendMessage(
        m.chat,
        { text: `Stamina kamu kurang dari 20. Silakan isi stamina terlebih dahulu dengan command *${m.prefix}heal*.` },
        { quoted: m }
      );
    }

    const cooldown = user.premium ? cooldownPremium : cooldownFree;
    const lastAdventure = user.lastadventure || 0;
    const timeElapsed = Date.now() - lastAdventure;

    if (timeElapsed < cooldown) {
      const remainingTime = cooldown - timeElapsed;
      return erlic.sendMessage(
        m.chat,
        { text: `Kamu sudah berpetualang, mohon tunggu *${func.msToTime(remainingTime)}* untuk *berpetualang* kembali.` },
        { quoted: m }
      );
    }

    user.lastadventure = Date.now();
    user.stamina -= 5;

    await erlic.sendMessage(m.chat, { text: "_Petualangan dimulai..._" }, { quoted: m });
    await new Promise(resolve => setTimeout(resolve, 10000));

    const minRange = user.premium ? 100 : 0;
    const maxRange = user.premium ? 5000 : 200;

    const rewards = {
      money: Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000,
      exp: Math.floor(Math.random() * (7000 - 1000 + 1)) + 1000,
      plastik: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
      rock: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
      kardus: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
      kaleng: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
      daun: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
      trash: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange,
      string: Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange
    };

    user.money += rewards.money;
    user.exp += rewards.exp;
    user.plastik += rewards.plastik;
    user.rock += rewards.rock;
    user.kardus += rewards.kardus;
    user.kaleng += rewards.kaleng;
    user.daun += rewards.daun;
    user.trash += rewards.trash;
    user.string += rewards.string;

    let rewardMessage = `乂 *RPG - ADVENTURE*\n\n` +
      `Stamina: ${user.stamina}/100\n` +
      `EXP: ${rewards.exp}\n` +
      `Money: $${rewards.money}\n\n` +
      `Plastik: ${rewards.plastik}\n` +
      `Rock: ${rewards.rock}\n` +
      `Kardus: ${rewards.kardus}\n` +
      `Kaleng: ${rewards.kaleng}\n` +
      `Daun: ${rewards.daun}\n` +
      `Trash: ${rewards.trash}\n` +
      `String: ${rewards.string}`;

    erlic.sendMessage(m.chat, { text: rewardMessage }, { quoted: m });
  },
  restrict: true,
  limit: true,
  location: 'plugins/rpg/adventure.js'
};