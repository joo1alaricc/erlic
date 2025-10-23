const fetch = require('node-fetch');

exports.run = {
    usage: ['payment'],
    use: 'nominal,nomor',
    category: 'owner',
    async: async (m, { erlic, text }) => {
        try {
            if (!text.includes(',')) {
                return erlic.sendMessage(m.chat, { text: '❌ Format salah!\nGunakan: .payment nominal,nomor\nContoh: .payment 1000,628387830819' }, { quoted: m });
            }

            let [amountRaw, targetRaw] = text.split(',').map(a => a.trim());
            let amount = parseInt(amountRaw);
            let target = targetRaw.replace(/[^0-9]/g, '');

            if (isNaN(amount) || amount <= 0 || !target) {
                return erlic.sendMessage(m.chat, { text: '❌ Nominal atau nomor tidak valid!' }, { quoted: m });
            }

            // Format nomor tujuan
            if (target.startsWith('0')) {
                target = '62' + target.slice(1);
            } else if (target.startsWith('+62')) {
                target = target.replace('+', '');
            }

            // API BetaBotz
            const apiUrl = `https://api.betabotz.eu.org/api/tools/create-qr?qr=00020101021126570011ID.DANA.WWW011893600915399188720402099918872040303UMI51440014ID.CO.QRIS.WWW0215ID10254321330860303UMI5204737253033605802ID5910TIAN STORE6004011161054037463041B1A&ammount=${amount}&apikey=Btz-Yt7gn`;

            const res = await fetch(apiUrl);
            const data = await res.json();

            if (!data.status || !data.result) {
                return erlic.sendMessage(m.chat, { text: '⚠️ Gagal membuat QR Code. Coba lagi nanti.' }, { quoted: m });
            }

            // Kirim QR ke target
            await erlic.sendMessage(target + '@s.whatsapp.net', {
                image: { url: data.result },
                caption: `*Payment Request*\nNominal: Rp${amount.toLocaleString('id-ID')}\n\n_Silakan scan QRIS ini untuk melanjutkan pembayaran._`
            }, { quoted: m });

            // Konfirmasi ke owner
            await erlic.sendMessage(m.chat, { 
                text: `✅ QR Payment sebesar Rp${amount.toLocaleString('id-ID')} berhasil dikirim ke ${target}` 
            }, { quoted: m });

        } catch (e) {
            console.error(e);
            erlic.sendMessage(m.chat, { text: '⚠️ Terjadi kesalahan saat membuat pembayaran.' }, { quoted: m });
        }
    },
    owner: true,
    location: "plugins/owner/payment.js"
};