const fs = require('fs');

function formatMoney(amount) { 
    return amount.toLocaleString('id-ID');
}

exports.run = {
    usage: ['done'],
    use: 'product,nominal,tujuan',
    category: 'owner',
    async: async (m, { erlic, func, users, setting, qchanel, text }) => { 
        
        let args = text.split(',');
        if (args.length < 3) {
            return erlic.sendMessage(m.chat, { text: 'Format salah! Gunakan: .done product,nominal,tujuan' }, { quoted: m });
        }

        let product = args[0].trim();
        let nominal = parseInt((args[1] || '').replace(/[^0-9]/g, ''), 10);
        let target = args[2].replace(/[^0-9]/g, ''); 

        if (!product || isNaN(nominal) || nominal <= 0 || !target) {
            return erlic.sendMessage(m.chat, { text: 'Format salah atau data tidak valid! Pastikan produk, nominal, dan tujuan benar.' }, { quoted: m });
        }

        // Konversi nomor tujuan agar sesuai format 62xxxxxxxxx
        if (target.startsWith('0')) {
            target = '62' + target.slice(1);
        } else if (target.startsWith('+62')) {
            target = target.replace('+', '');
        }

        let now = new Date();
        let tanggal = now.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        let waktu = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // generate ID
        let invoiceId = func.messageId(5);
        let serial = Date.now();

        // ambil nickname dari target, kalau tidak ada pakai '-'
        let nickname = users[target] ? users[target].name : '-';

        // URL endpoint gambar
        const apiUrl = 'https://editor.vreden.my.id/transaksi';
        const params = new URLSearchParams({
            date: tanggal,
            id: invoiceId,
            product: product,
            tujuan: target,
            nickname: nickname,
            nominal: `${formatMoney(nominal)}`,
            serial: serial,
            store: 'Erlic Store',
            status: 'success'
        }).toString();

        const fullUrl = `${apiUrl}?${params}`;

        // kirim gambar ke tujuan
        await erlic.sendMessage(target + '@s.whatsapp.net', {
            image: { url: fullUrl },
            caption: `_Transaction successful, thank you for purchasing our product._`
        }, { quoted: func.fstatus("System Notification") });

        // konfirmasi ke chat owner
        erlic.sendMessage(m.chat, { text: 'Transaksi berhasil dikirim sebagai gambar!' }, { quoted: m });
    },
    owner: true,
    location: "plugins/owner/done.js"
};