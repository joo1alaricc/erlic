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
  usage: ['sell'],
  use: 'item,count',
  category: 'rpg',
  location: 'plugins/rpg/sell.js',
  async: async (m, { erlic, setting, text }) => {
    if (!global.db.users) global.db.users = {};
    if (!global.db.users[m.sender]) {
      global.db.users[m.sender] = new Proxy({}, {
        get: (target, prop) => prop in target ? target[prop] : 0,
        set: (target, prop, value) => { target[prop] = value; return true; }
      });
    }

    const seller = global.db.users[m.sender];
    const items = {
      bibit: { bibitanggur:{price:1000,icon:'🍇'}, bibitapel:{price:1000,icon:'🍎'}, bibitjeruk:{price:1000,icon:'🍊'}, bibitmangga:{price:1000,icon:'🥭'}, bibitpisang:{price:1000,icon:'🍌'}, bibitwortel:{price:500,icon:'🥕'}, bibitlabu:{price:500,icon:'🎃'}, bibitkubis:{price:500,icon:'🥬'}, bibitterong:{price:500,icon:'🍆'}, bibitkentang:{price:500,icon:'🥔'}, bibittomat:{price:500,icon:'🍅'} },
      buah: { anggur:{price:1000,icon:'🍇'}, apel:{price:1000,icon:'🍎'}, jeruk:{price:1000,icon:'🍊'}, mangga:{price:1000,icon:'🥭'}, pisang:{price:1000,icon:'🍌'} },
      sayur: { wortel:{price:750,icon:'🥕'}, labu:{price:750,icon:'🎃'}, kubis:{price:750,icon:'🥬'}, terong:{price:750,icon:'🍆'}, kentang:{price:1000,icon:'🥔'}, tomat:{price:1000,icon:'🍅'} },
      hewan: { banteng:{price:1000,icon:'🐂'}, harimau:{price:1000,icon:'🐅'}, gajah:{price:1000,icon:'🐘'}, kambing:{price:1000,icon:'🐐'}, panda:{price:1000,icon:'🐼'}, buaya:{price:1000,icon:'🐊'}, kerbau:{price:1000,icon:'🐃'}, sapi:{price:1000,icon:'🐄'}, monyet:{price:1000,icon:'🐒'}, babi:{price:1000,icon:'🐖'}, babihutan:{price:1000,icon:'🐗'}, ayam:{price:1000,icon:'🐓'} },
      seafood: { tongkol:{price:1000,icon:'🐟'}, buntal:{price:1000,icon:'🐡'}, kepiting:{price:1000,icon:'🦀'}, udang:{price:1000,icon:'🦐'}, kerang:{price:1000,icon:'🐚'}, pausmini:{price:1000,icon:'🐋'}, gurita:{price:1000,icon:'🐙'}, nila:{price:1000,icon:'🐠'}, cumi:{price:1000,icon:'🦑'}, langka:{price:1000,icon:'🐳'} },
      sampah: { plastik:{price:100,icon:'🍶'}, batu:{price:100,icon:'🪨'}, kardus:{price:100,icon:'📦'}, kaleng:{price:100,icon:'🥫'}, daun:{price:100,icon:'🍂'}, trash:{price:100,icon:'🗑️'} },
      spaces: { meteorit:{price:100,icon:'☄️'}, crystal:{price:100,icon:'💎'}, metal:{price:100,icon:'🔩'}, stardust:{price:100,icon:'✨'}, alien_artifact:{price:100,icon:'🛸'}, moon_rock:{price:100,icon:'🌑'}, unknown_substance:{price:100,icon:'🧪'} }
    };

    const categories = Object.keys(items);

    if (!text) {
      let teks = '';
      for (const category of categories) {
        const totalItems = Object.keys(items[category]).reduce((sum, name) => sum + (seller[name] || 0), 0);
        teks += `*${category.toUpperCase()}*\n`;
        for (const [itemName, item] of Object.entries(items[category])) {
          teks += `${item.icon} ${itemName.replace(/_/g,' ')} - ${formatMoney(item.price)}\n`;
        }
        teks += `Total: ${totalItems} items\n> ${setting.prefix}sell ${category} untuk jual semua\n\n`;
      }
      return erlic.sendMessage(m.chat, { text: teks }, { quoted: m });
    }

    const args = text.split(/\s+/);
    const itemToSell = args[0].toLowerCase();
    const sellAmount = parseInt(args[1], 10);

    const generateStruk = (productName, totalAmount) => {
      const now = new Date().toISOString().split('T')[0];
      const serial = `SN${Date.now()}`;
      const id = `INV${Date.now()}`;
      const reff_id = randomCode(8);
      const code = randomCode(6);
      return getStrukImageURL({
        tanggal: now,
        serial,
        status: 'Berhasil',
        id,
        reff_id,
        code,
        product: productName,
        tujuan: m.sender.split('@')[0],
        note: 'Transaksi RPG Bot',
        nominal: formatMoney(totalAmount),
        admin: '0',
        total: formatMoney(totalAmount),
        store: global.botname
      });
    };

    if (categories.includes(itemToSell)) {
      let totalProfit = 0, totalItems = 0;
      for (const [name, item] of Object.entries(items[itemToSell])) {
        const amount = seller[name] || 0;
        totalProfit += amount * item.price;
        totalItems += amount;
        seller[name] = 0;
      }
      seller.money += totalProfit;

      const teks = `乂 *TRANSACTION - SELL*\nCategory: ALL ${itemToSell.toUpperCase()}\nCount: ${totalItems}\nTotal: Rp ${formatMoney(totalProfit)}\nStatus: Berhasil ✅`;
      const fullUrl = generateStruk(`ALL ${itemToSell.toUpperCase()}`, totalProfit);

      return erlic.sendMessage(m.chat, { image: { url: fullUrl }, caption: teks }, { quoted: m });
    }

    // jual item spesifik
    let selectedItem;
    for (const cat of categories) if (items[cat][itemToSell]) { selectedItem = items[cat][itemToSell]; break; }
    if (!selectedItem) return erlic.sendMessage(m.chat, { text: `Item "${itemToSell}" tidak ditemukan!` }, { quoted: m });
    if (isNaN(sellAmount) || sellAmount <= 0) return erlic.sendMessage(m.chat, { text: 'Jumlah harus valid dan >0' }, { quoted: m });
    if ((seller[itemToSell] || 0) < sellAmount) return erlic.sendMessage(m.chat, { text: `Kamu tidak punya cukup ${itemToSell}` }, { quoted: m });

    const totalPrice = selectedItem.price * sellAmount;
    seller[itemToSell] -= sellAmount;
    seller.money += totalPrice;

    const teks = `乂 *TRANSACTION - SELL*\nItem: ${selectedItem.icon} ${itemToSell.toUpperCase()}\nCount: ${sellAmount}\nPrice: Rp ${formatMoney(selectedItem.price)}\nTotal: Rp ${formatMoney(totalPrice)}\nStatus: Berhasil ✅`;
    const fullUrl = generateStruk(`${selectedItem.icon} ${itemToSell.toUpperCase()}`, totalPrice);

    return erlic.sendMessage(m.chat, { image: { url: fullUrl }, caption: teks }, { quoted: m });
  },
  restrict: true
};