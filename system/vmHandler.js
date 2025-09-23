const util = require('util');

async function cekError(erlic, m, error, name = 'Unknown') {
  try {
    const botNumbr = await erlic.decodeJid(erlic.user.id);
   const setting = global.db.setting

    // Pastikan global.owner, global.prems, global.developer ada dan berupa array
    const owners = Array.isArray(global.owner) ? global.owner : [global.owner];
    const prems = Array.isArray(global.prems) ? global.prems : [global.prems];
    const devs = Array.isArray(global.developer) ? global.developer : [global.developer];
    
    const allCreators = [botNumbr, ...setting.owner, ...owners, ...prems, ...devs]
      .map(v => (v || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net');

    const isCreato = m?.sender && allCreators.includes(m.sender);

    const bud = typeof m.text === 'string' ? m.text : '';

    // Cek apakah global.customPrefix tersedia dan array
    const customPrefix = (Array.isArray(setting?.prefix)
  ? setting.prefix
  : setting?.prefix !== undefined
    ? [setting.prefix]
    : ['.']
);

const prefixRegx = new RegExp(
  `^(${customPrefix
    .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})`
);

    const path = require('path');
const pref = global.db.setting
    const pripej = pref?.prefix || '.';

    const matchedPrefix = bud.match(prefixRegx);
    const prefix = isCreato
      ? (matchedPrefix ? matchedPrefix[0] : '')
      : (matchedPrefix ? matchedPrefix[0] : pripej) || pripej || '.';

    const isCmd = isCreato
      ? (matchedPrefix || !prefixRegx.test(bud))
      : bud.startsWith(prefix);

    const comd = isCmd
      ? bud.slice(prefix.length).trim().split(' ').shift().toLowerCase()
      : '';

    const jsonFormat = (err) => {
      if (typeof err === 'string') return err;
      if (err instanceof Error) return err.stack || `${err.name}: ${err.message}`;
      return util.format(err);
    };

    if (error?.name) {
      for (let owner of devs) {
        let id = owner.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        let [jid] = await erlic.onWhatsApp(id);
        if (!jid?.exists) continue;

        let caption = `───「 *SYSTEM ERROR* 」───\n\n`;
        caption += `${jsonFormat(error)}`;

        await erlic.sendMessage(id, { text: caption }, { quoted: m });
      }

      m.reply(`Maaf! ada yang error :(\nLaporan error telah dikirim ke developer otomatis untuk diperbaiki.`);
    } else {
      m.reply(`${jsonFormat(error)}`);
    }
  } catch (err) {
    console.error('Error in cekError:', err);
    m.reply('Terjadi kesalahan saat mengirim laporan error.');
  }
}

module.exports = cekError;