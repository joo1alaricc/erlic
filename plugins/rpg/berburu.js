exports.run = {
  usage: ['berburu'],
  hidden: ['hunt'],
  category: 'rpg',
  async: async (m, { func, erlic, setting }) => {

    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) {
            if (prop === 'stamina') target[prop] = 100;
            else if (prop === 'premium') target[prop] = false;
            else if (prop === 'lastberburu') target[prop] = 0;
            else if (['durabilitiesSword','durabilitiesBow','durabilitiesArmor'].includes(prop)) target[prop] = 100;
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

    if (user.stamina < 30) {
      return erlic.sendMessage(m.chat, {
        text: `Stamina kamu kurang dari 30. Silakan isi stamina terlebih dahulu dengan command *${m.prefix}heal*.`
      }, { quoted: m });
    }

    const requiredItems = ['sword', 'bow', 'armor'];
    let missingItems = [];
    let ownedItems = [];

    requiredItems.forEach(item => {
      if (!user[item] || user[item] <= 0) {
        missingItems.push(item);
      } else {
        ownedItems.push(`${item.charAt(0).toUpperCase() + item.slice(1)}: ${user[item]}`);
      }
    });

    if (missingItems.length > 0) {
      let missingItemsText = missingItems.map(item => {
        if (item === 'sword') return '⚔️ Sword';
        if (item === 'bow') return '🏹 Bow';
        if (item === 'armor') return '🥼 Armor';
      }).join('\n');

      let ownedItemsText = ownedItems.length > 0 ? `\n\nKamu hanya memiliki:\n${ownedItems.join('\n')}` : '';
      let teks = `Kamu kekurangan alat untuk berburu:\n${missingItemsText} \n\nSilahkan buat terlebih dahulu dengan command:\n${m.prefix}create *item count*\nContoh:\n${m.prefix}create bow 1` + ownedItemsText;

      return erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
    }

    const cooldownPremium = 10 * 60 * 1000;
    const cooldownFree = 30 * 60 * 1000;
    const cooldown = user.premium ? cooldownPremium : cooldownFree;

    if (Date.now() - user.lastberburu < cooldown) {
      const remainingTime = cooldown - (Date.now() - user.lastberburu);
      let teks = `Kamu sudah berburu, mohon tunggu *${func.msToTime(remainingTime)}* untuk bisa *berburu* kembali.`;
      return erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
    }

    user.lastberburu = Date.now();
    user.stamina -= 5;

    if (user.durabilitiesSword > 0) {
      user.durabilitiesSword -= 5;
      if (user.durabilitiesSword <= 0) delete user.sword;
    }
    if (user.durabilitiesBow > 0) {
      user.durabilitiesBow -= 5;
      if (user.durabilitiesBow <= 0) delete user.bow;
    }
    if (user.durabilitiesArmor > 0) {
      user.durabilitiesArmor -= 5;
      if (user.durabilitiesArmor <= 0) delete user.armor;
    }

    await erlic.sendMessage(m.chat, { text: '_Pemburuan dimulai..._' }, { quoted: m });

    setTimeout(() => {
      let randomResults = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
      let rewards = randomResults.map(num => num * (user.premium ? 5 : 1));

      let hsl = `乂 *RPG - BERBURU*

Sisa stamina: ${user.stamina} / 100
Durability:
- Armor: ${user.durabilitiesArmor}
- Sword: ${user.durabilitiesSword}
- Bow: ${user.durabilitiesBow}

Hasil berburu ${m.pushname}
🐂 Banteng = ${rewards[0]}        🐃 Kerbau = ${rewards[6]}
🐅 Harimau = ${rewards[1]}       🐮 Sapi = ${rewards[7]}
🐘 Gajah = ${rewards[2]}         🐒 Monyet = ${rewards[8]}
🐐 Kambing = ${rewards[3]}        🐗 Babi = ${rewards[9]}
🐼 Panda = ${rewards[4]}         🐖 Babi Hutan = ${rewards[10]}
🐊 Buaya = ${rewards[5]}         🐓 Ayam = ${rewards[11]}

> Ketik: ${setting.prefix}kandang untuk melihat hasilnya.`;

      const animals = ['banteng', 'harimau', 'gajah', 'kambing', 'panda', 'buaya', 'kerbau', 'sapi', 'monyet', 'babi', 'babihutan', 'ayam'];
      animals.forEach((animal, idx) => {
        global.db.users[m.sender][animal] += rewards[idx];
      });

      if (global.db.setting.fakereply) {
        erlic.sendMessageModify(
          m.chat,
          hsl,
          m,
          {
            title: "B E R B U R U",
            body: global.header,
            url: setting.link,
            thumbUrl: "https://files.catbox.moe/tqqogh.jpg",
            ads: true
          }
        );
      } else {
        erlic.reply(m.chat, hsl, m);
      }
    }, 10000);
  },
  limit: true,
  restrict: true,
  location: 'plugins/rpg/berburu.js'
};