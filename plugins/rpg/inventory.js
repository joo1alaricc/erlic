const axios = require('axios');

function formatMoney(amount) {
  return '$' + (amount || 0).toLocaleString('id-ID');
}

exports.run = {
  usage: ['inventory'],
  hidden: ['inv'],
  category: 'rpg',
  async: async (m, { func, erlic, setting }) => {
    await erlic.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    if (!global.db.users) global.db.users = {};

    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get(target, prop) {
          if (!(prop in target)) {
            if (prop === 'stamina') target[prop] = 100;
            else if (prop === 'premium') target[prop] = false;
            else if (prop === 'level') target[prop] = 1;
            else if (prop === 'exp') target[prop] = 0;
            else if (prop === 'order') target[prop] = 0;
            else if (prop === 'role') target[prop] = 'Bronze';
            else if (prop.startsWith('durabilities')) target[prop] = 100;
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

    const stamina = user.stamina || 0;
    const money = formatMoney(user.money || 0);
    const exp = user.exp || 0;
    const level = user.level || 1;
    const order = user.order || 0;
    const role = user.role || 'Bronze';
    const expRequired = 10 * Math.pow(level, 2) + 50 * level + 100;

    const categories = {
      'Masakan': { steak: user.steak || 0, sate: user.sate || 0, rendang: user.rendang || 0, kornet: user.kornet || 0, nugget: user.nugget || 0, bluefin: user.bluefin || 0, seafood: user.seafood || 0, moluska: user.moluska || 0, sushi: user.sushi || 0, squidprawm: user.squidprawm || 0 },
      'Bumbu': { kemiri: user.Kemiri || 0, bawang: user.Bawang || 0, cabai: user.Cabai || 0, saus: user.Saus || 0, asam: user.Asam || 0, jahe: user.Jahe || 0 },
      'Buah': { anggur: user.anggur || 0, apel: user.apel || 0, jeruk: user.jeruk || 0, mangga: user.mangga || 0, pisang: user.pisang || 0 },
      'Sayur': { tomat: user.tomat || 0, kubis: user.kubis || 0, labu: user.labu || 0, kentang: user.kentang || 0, terong: user.terong || 0, wortel: user.wortel || 0 },
      'Trash': { daun: user.daun || 0, kardus: user.kardus || 0, kaleng: user.kaleng || 0, kayu: user.kayu || 0, plastik: user.plastik || 0, trash: user.trash || 0 },
      'Tambang': { diamond: user.diamond || 0, iron: user.iron || 0, gold: user.gold || 0, emerald: user.emerald || 0 },
      'Kolam': { tongkol: user.tongkol || 0, pausmini: user.pausmini || 0, kepiting: user.kepiting || 0, buntal: user.buntal || 0, udang: user.udang || 0, cumi: user.cumi || 0, gurita: user.gurita || 0, nila: user.nila || 0, langka: user.langka || 0, kerang: user.kerang || 0 },
      'Hewan': { ayam: user.ayam || 0, babi: user.babi || 0, babihutan: user.babihutan || 0, banteng: user.banteng || 0, buaya: user.buaya || 0, gajah: user.gajah || 0, harimau: user.harimau || 0, kerbau: user.kerbau || 0, monyet: user.monyet || 0, panda: user.panda || 0, sapi: user.sapi || 0 },
      'Space Items': { meteorit: user.meteorit || 0, crystal: user.crystal || 0, metal: user.metal || 0, stardust: user.stardust || 0, alien_artifact: user.alien_artifact || 0, moon_rock: user.moon_rock || 0, unknown_substance: user.unknown_substance || 0 }
    };

    const weaponsAndArmor = {
      sword: { count: user.sword || 0, durability: user.durabilitiesSword || 0 },
      bow: { count: user.bow || 0, durability: user.durabilitiesBow || 0 },
      pickaxe: { count: user.pickaxe || 0, durability: user.durabilitiesPickaxe || 0 },
      axe: { count: user.axe || 0, durability: user.durabilitiesAxe || 0 },
      armor: { count: user.armor || 0, durability: user.durabilitiesArmor || 0 },
      fishingrod: { count: user.fishingrod || 0, durability: user.durabilitiesFishingrod || 0 }
    };

    let inventoryText = `*Stamina:* ${stamina}/100\n*Money:* ${money}\n*Exp:* ${exp} / ${expRequired}\n*Role:* ${role}\n*Orderan:* ${order}\n\n`;

    for (let [title, items] of Object.entries(categories)) {
      inventoryText += `*${title.toUpperCase()}*\n`;
      for (let [item, count] of Object.entries(items)) {
        inventoryText += `- ${item.charAt(0).toUpperCase() + item.slice(1).replace('_', ' ')}: ${count}\n`;
      }
      inventoryText += `\n`;
    }

    let weaponText = '*WEAPON & ARMOR*\n';
    for (let [item, { count, durability }] of Object.entries(weaponsAndArmor)) {
      weaponText += `- ${item.charAt(0).toUpperCase() + item.slice(1)}: ${count} (Durability: ${durability})\n`;
    }
    inventoryText += weaponText;

    let profilePicUrl = setting.cover || 'https://example.com/default_cover.jpg';
    try {
      const profilePic = await erlic.profilePictureUrl(m.sender, 'image');
      if (profilePic) profilePicUrl = profilePic;
    } catch (e) {
      console.log('Gagal mengambil foto profil, menggunakan default cover.');
    }

    await erlic.sendMessage(m.chat, {
      text: inventoryText,
      contextInfo: {
        externalAdReply: {
          title: `INVENTORY - ${(m.pushname || 'User').toUpperCase()}`,
          body: global.header || '',
          mediaType: 1,
          renderLargerThumbnail: true,
          thumbnailUrl: profilePicUrl,
          sourceUrl: ''
        }
      }
    }, { quoted: func.fstatus("INVENTORY") });

  },
  location: 'plugins/rpg/inventory.js'
};