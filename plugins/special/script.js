const fs = require('fs');
const axios = require('axios');

// Fungsi format harga (K, M, B)
const formatHarga = (harga) => {
  if (harga >= 1_000_000_000) return (harga / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (harga >= 1_000_000) return (harga / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (harga >= 1_000) return (harga / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return harga.toString();
};

exports.run = {
  usage: ['script'],
  hidden: ['sc'],
  category: 'special',

  async: async (m, { erlic, setting }) => {
    let hargaNormal = 60000; // Harga default

    // Coba baca harga dari hargasc.json
    try {
      const hargaData = setting.hargasc;
      if (hargaData && hargaData.harga) {
        hargaNormal = hargaData.harga;
      }
    } catch (err) {
      console.error('Gagal mengambil harga dari setting.hargasc:', err);
    }

    const hargaDiskon = hargaNormal - (hargaNormal * 0.20); // Diskon 20%

    // URL buyer.json
    const repoDATAWANumber = 'https://github.com/joo1alaricc/buyer/blob/main/buyer.json';
    const rawDATAWANumber = repoDATAWANumber
      .replace("https://github", "https://raw.githubusercontent")
      .replace("/blob/", "/");

    let buyerListText = '';

    // Fetch daftar pembeli
    try {
      const res = await axios.get(rawDATAWANumber);
      const buyerData = res.data;

      if (Array.isArray(buyerData) && buyerData.length > 0) {
        buyerListText = '\n\n*LIST PEMBELI SCRIPT:*\n';
        buyerData.forEach((buyer, index) => {
          const buyerName = buyer.name.charAt(0).toUpperCase() + buyer.name.slice(1);
          buyerListText += `${index + 1}. ${buyerName} ➠ ${formatHarga(buyer.harga)}\n`;
        });
      } else {
        buyerListText = '\n\nBelum ada pembeli yang terdaftar.';
      }
    } catch (err) {
      buyerListText = '\n\nGagal memuat daftar pembeli.';
      console.error('Gagal fetch buyer.json:', err.message);
    }

    // Baca jumlah fitur dari menu.json
    const menuPath = './database/menu.json';
    let totalFittur = 0;
    try {
      const menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
      totalFittur = menu.reduce((total, obj) => total + Object.values(obj)[0].length, 0);
    } catch (err) {
      console.error('Gagal baca menu.json:', err);
      totalFittur = '???';
    }

    // Baca versi dari package.json
    const pkg = require('../../package.json'); // Sesuaikan path jika perlu

    // Teks promosi
    const teks = `*SELL SCRIPT ${global.botname.toUpperCase()} BOT V${pkg.version}*

- Normal price: ${formatHarga(hargaNormal)}
- Discount price: ${formatHarga(hargaDiskon)}
- Features: ${totalFittur}+
- Type: Case x Plugins

*Key Features:*
- Support Pairing
- Size dibawah 5MB
- Security access

*Preview Features:*
- System update automatically
- Auto backup script
- Support LID
- Downloader (tiktok, instagram, facebook, snackvideo, twitter, capcut, youtube dll)
- Many useful tools
- Tiktok Search
- AI (Chat AI, Generate AI)
- Remini
- And more...

*Requirements:*
- NodeJS v18
- FFMPEG
- Min. 4GB RAM

*Benefit:*
- Free update
- Request Features (additional cost)
- Fixing Features (additional cost)
- Free server 1 month 

Jika anda berminat silahkan hubungi
wa.me/6282245682288${buyerListText}`;

    // Kirim sebagai Payment Request
    const nominal = hargaDiskon;
    await erlic.relayMessage(m.chat, {
      requestPaymentMessage: {
        currencyCodeIso4217: 'IDR',
        amount1000: `${nominal}000`,
        requestFrom: m.sender,
        noteMessage: {
          extendedTextMessage: {
            text: teks,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: false,
              }
            }
          }
        }
      }
    }, { quoted: m });
  },

  location: 'plugins/special/script.js'
};