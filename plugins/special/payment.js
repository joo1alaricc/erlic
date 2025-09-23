exports.run = {
    usage: ['payment'],
    use: 'produk,nominal,tujuan',
    category: 'owner',
    async: async (m, { erlic, func, qlive, text }) => {

        const capital = (str) => str.replace(/^\w/, c => c.toUpperCase());

        if (!text) return m.reply('Format salah! Contoh: payment Pulsa,10000,08123456789');

        let args = text.split(',');
        if (args.length < 3) return m.reply('Format salah! Gunakan: payment produk,nominal,tujuan');

        let product = args[0].trim();
        let nominal = parseInt(args[1].replace(/[^0-9]/g, ''), 10);
        let target = args[2].replace(/[^0-9]/g, '');

        if (!product || isNaN(nominal) || nominal <= 0) return m.reply('Produk atau nominal tidak valid!');
        if (!target) return m.reply('Nomor tujuan tidak valid!');

        // format nomor tujuan
        if (target.startsWith('0')) target = '62' + target.slice(1);
        else if (target.startsWith('+62')) target = target.replace('+', '');

        // generate URL QR dinamis
        const apiUrl = 'https://editor.vreden.my.id/qris2';
        const params = new URLSearchParams({
            url: global.qris || '',
            nominal: nominal,
            expired: '30 Minutes',
            store: 'Erlic Store'
        }).toString();
        const fullUrl = `${apiUrl}?${params}`;

        // buat caption tagihan
        let caption = `Silahkan scan QR diatas untuk membayar:\n- Produk: ${product}\n- Nominal: Rp${nominal.toLocaleString('id-ID')}`;

        // tambahkan daftar nomor payment jika tersedia
        const paymentList = ['ovo', 'dana', 'shopeepay', 'gopay', 'seabank', 'pulsa', 'pulsa2'];
        const availablePayments = [];
        for (const method of paymentList) {
            if (global[method]) availablePayments.push(`⭝ ${capital(method)}: ${global[method]}`);
        }
        if (availablePayments.length) caption += `\n\nAtau bisa transfer ke nomor:\n${availablePayments.join('\n')}`;

        // kirim QR sebagai image ke nomor target
        await erlic.sendMessage(target + '@s.whatsapp.net', {
            image: { url: fullUrl },
            caption: caption
        }, { quoted: func.fstatus("System Notification ")});

        // konfirmasi ke pengirim
        m.reply(`Tagihan berhasil dikirim ke nomor ${target} sebagai gambar.`);
    },
    owner: true,
    location: "plugins/special/payment.js"
};