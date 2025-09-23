const cooldownFree = 3600000; // 1 jam untuk pengguna free
const cooldownPremium = 1800000; // 30 menit untuk pengguna premium

const adventurePlaces = [
  { name: "Tundra", image: "https://files.catbox.moe/v1jqbc.png", rewards: ["magnetit", "hematit", "dolomit", "platinum", "jamur"] },
  { name: "Pantai", image: "https://files.catbox.moe/a4g8iu.png", rewards: ["mutiara", "driftwood", "granit", "kelp", "seaweed"] },
  { name: "Mountain", image: "https://files.catbox.moe/ziau42.jpg", rewards: ["perak", "kulitular", "kulitbuaya", "fosilhewan", "fosiltumbuhan"] },
  { name: "Hutan Mangrove", image: "https://files.catbox.moe/04367w.jpg", rewards: ["mangrove", "kulitikan", "kaktuslaut", "kulitpenyu", "batupasir"] },
  { name: "Desert", image: "https://files.catbox.moe/trpo39.jpg", rewards: ["mineral", "fosil", "permata", "logam", "artefak"] },
  { name: "Tropical Forest", image: "https://files.catbox.moe/unm5cy.jpg", rewards: ["saranglebah", "batualam", "kulitkayu", "rubi", "zamrud"] },
  { name: "Boreal Forest", image: "https://files.catbox.moe/kz3k6g.jpg", rewards: ["kronium", "nikel", "kuarsa", "batuakik", "birch"] },
  { name: "Savannah", image: "https://files.catbox.moe/r2vi2k.jpg", rewards: ["amethyst", "citrine", "feldspar", "kalsit", "dolomit"] }
];

exports.run = {
  usage: ['adventure3'],
  hidden: ['adv3'],
  category: 'rpg',
  async: async (m, { func, erlic, text }) => {
    // Inisialisasi DB & proxy
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

    // Pastikan m.args aman
    let selectedNumber = ((m.args && m.args[0]) || text || '').toString().replace(/[^0-9]/g, '');
    let placeIndex = Number(selectedNumber) - 1;

    if (!selectedNumber) {
      let textList = `*PILIH TEMPAT BERPETUALANG*\n\n`;
      adventurePlaces.forEach((place, index) => {
        textList += `${index + 1}. ${place.name}\n`;
      });
      textList += `\nKetik: *.adventure3 <nomor>*\nContoh: *.adventure3 3*`;
      return erlic.sendMessage(m.chat, {
        text: textList,
        contextInfo: {
          externalAdReply: {
            title: `SELECT PLACE`,
            body: global.header,
            thumbnailUrl: 'https://files.catbox.moe/2vtqit.png',
            sourceUrl: '',
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true
          }
        }
      }, { quoted: m });
    }

    if (isNaN(placeIndex) || placeIndex < 0 || placeIndex >= adventurePlaces.length) {
      return erlic.sendMessage(m.chat, { text: "Nomor tempat tidak valid. Silakan pilih nomor yang tersedia." }, { quoted: m });
    }

    let selectedPlace = adventurePlaces[placeIndex];

    if (user.stamina < 20) {
      return erlic.sendMessage(m.chat, { text: `Stamina kamu kurang dari 20. Gunakan *${m.prefix}heal* untuk mengisi stamina.` }, { quoted: m });
    }

    const cooldown = user.premium ? cooldownPremium : cooldownFree;
    const lastAdventure = user.lastadventure3 || 0;
    const timeElapsed = Date.now() - lastAdventure;

    if (timeElapsed < cooldown) {
      const remainingTime = cooldown - timeElapsed;
      return erlic.sendMessage(m.chat, { text: `Tunggu *${func.msToTime(remainingTime)}* sebelum berpetualang lagi.` }, { quoted: m });
    }

    user.lastadventure3 = Date.now();
    user.stamina -= 6;

    await erlic.sendMessage(m.chat, { text: `Berpetualang ke ${selectedPlace.name}...` }, { quoted: m });
    await new Promise(resolve => setTimeout(resolve, 10000));

    let rewards = selectedPlace.rewards.map(item => ({ item, amount: Math.floor(Math.random() * 5) + 1 }));
    rewards.forEach(({ item, amount }) => user[item] = (user[item] || 0) + amount);

    let rewardMessage = `*ADVENTURE - ${selectedPlace.name.toUpperCase()}*\n\n` +
      `*Tempat:* ${selectedPlace.name}\n` +
      `*Stamina:* ${user.stamina}/100\n\n` +
      `*Hadiah Ditemukan:*\n` +
      rewards.map(({ item, amount }) => `- ${item.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase()}: ${amount}`).join("\n");

    await erlic.sendMessage(m.chat, {
      text: rewardMessage,
      contextInfo: {
        externalAdReply: {
          title: `Berpetualang ke ${selectedPlace.name}`,
          body: `Kamu mendapatkan hadiah baru!`,
          thumbnailUrl: selectedPlace.image,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: false
        }
      }
    }, { quoted: m });
  },
  restrict: true,
  limit: true,
  location: 'plugins/rpg/adventure3.js'
};