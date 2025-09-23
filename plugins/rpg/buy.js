const fetch = require('node-fetch');

function formatMoney(amount) {
  return amount.toLocaleString('id-ID');
}

function randomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

function getStrukImageURL({ tanggal, serial, status, id, reff_id, code, product, tujuan, note, nominal, admin, total, store }) {
  const apiUrl = 'https://editor.vreden.my.id/struk';
  const params = new URLSearchParams({
    tanggal,
    serial,
    status,
    id,
    reff_id,
    code,
    product,
    tujuan,
    note,
    nominal,
    admin,
    total,
    store
  }).toString();
  return `${apiUrl}?${params}`;
}

exports.run = {
  usage: ['buy'],
  use: 'item,count',
  category: 'rpg',
  location: 'plugins/rpg/buy.js',
  async: async (m, { erlic, setting, text }) => {
    if (!text) return erlic.sendMessage(m.chat, { text: `Contoh: ${setting.prefix}buy bawang 10` }, { quoted: m });

    if (!global.db.users) global.db.users = {};
    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get: (target, prop) => prop in target ? target[prop] : 0,
        set: (target, prop, value) => { target[prop] = value; return true; }
      });
    }
    const user = global.db.users[m.sender];

    const items = {
      Bumbu: { Bawang: { price: 300, icon: '🧄' }, Kemiri: { price: 500, icon: '🌰' }, Jahe: { price: 800, icon: '🫚' }, Asam: { price: 400, icon: '🍋' }, Cabai: { price: 700, icon: '🌶️' }, Saus: { price: 350, icon: '🍾' } },
      Ternak: { Ayam: { price: 2000, icon: '🐓' }, Babi: { price: 5000, icon: '🐖' }, Babihutan: { price: 10000, icon: '🐗' }, Banteng: { price: 20000, icon: '🐂' }, Kambing: { price: 15000, icon: '🐐' }, Kerbau: { price: 30000, icon: '🐃' }, Panda: { price: 50000, icon: '🐼' }, Sapi: { price: 50000, icon: '🐄' }, Monyet: { price: 25000, icon: '🐒' } },
      Buah: { Anggur: { price: 200, icon: '🍇' }, Apel: { price: 500, icon: '🍎' }, Jeruk: { price: 1000, icon: '🍊' }, Mangga: { price: 1500, icon: '🥭' }, Pisang: { price: 3000, icon: '🍌' } },
      Sayur: { Wortel: { price: 750, icon: '🥕' }, Labu: { price: 750, icon: '🎃' }, Kubis: { price: 750, icon: '🥬' }, Terong: { price: 750, icon: '🍆' }, Kentang: { price: 1000, icon: '🥔' }, Tomat: { price: 1000, icon: '🍅' } },
      Tambang: { Rock: { price: 8000, icon: '🪨' }, Diamond: { price: 100000, icon: '💎' }, Emerald: { price: 90000, icon: '🟢' }, Gold: { price: 70000, icon: '🥇' }, Iron: { price: 60000, icon: '⛏️' } },
      Seafood: { Tongkol: { price: 3000, icon: '🐟' }, Buntal: { price: 5000, icon: '🐡' }, Pausmini: { price: 8000, icon: '🐋' }, Udang: { price: 4000, icon: '🦐' }, Gurita: { price: 7000, icon: '🐙' }, Nila: { price: 3500, icon: '🐠' }, Cumi: { price: 6000, icon: '🦑' }, Langka: { price: 12000, icon: '🐳' }, Kepiting: { price: 5000, icon: '🦀' }, Kerang: { price: 3000, icon: '🐚' } }
    };

    const args = text.split(/\s+/);
    const itemNameInput = args[0];
    const buyAmount = parseInt(args[1], 10);
    if (isNaN(buyAmount) || buyAmount <= 0) return erlic.sendMessage(m.chat, { text: 'Jumlah harus valid dan >0' }, { quoted: m });

    // cari item case-insensitive
    let selectedItem, selectedKey, selectedCategory;
    for (const cat of Object.keys(items)) {
      for (const [key, item] of Object.entries(items[cat])) {
        if (key.toLowerCase() === itemNameInput.toLowerCase()) {
          selectedItem = item;
          selectedKey = key;
          selectedCategory = cat;
          break;
        }
      }
      if (selectedItem) break;
    }
    if (!selectedItem) return erlic.sendMessage(m.chat, { text: `Item "${itemNameInput}" tidak ditemukan!` }, { quoted: m });

    const totalPrice = selectedItem.price * buyAmount;
    user[selectedKey] += buyAmount;
    user.money = (user.money || 0) - totalPrice;

    // generate struk image
    const now = new Date().toISOString().split('T')[0];
    const fullUrl = getStrukImageURL({
      tanggal: now,
      serial: `SN${Date.now()}`,
      status: 'Berhasil',
      id: `INV${Date.now()}`,
      reff_id: randomCode(8),
      code: randomCode(6),
      product: `${selectedItem.icon} ${selectedKey} x${buyAmount}`,
      tujuan: m.sender.split('@')[0],
      note: '',
      nominal: formatMoney(totalPrice),
      admin: '0',
      total: formatMoney(totalPrice),
      store: global.botname
    });

    const teks = `✅ Berhasil membeli *${selectedItem.icon} ${selectedKey}* x${buyAmount}\nTotal: Rp ${formatMoney(totalPrice)}`;

    return erlic.sendMessage(m.chat, { image: { url: fullUrl }, caption: teks }, { quoted: m });
  },
  restrict: true
};