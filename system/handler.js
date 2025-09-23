const fs = require("fs");
const path = require("path");
const cekError = require('./vmHandler');
const moment = require('moment-timezone')

const loadPlugins = async () => {
  const baseDir = path.join(__dirname, "../plugins");
  const plugins = [];

  const walkDir = dir => {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) results = results.concat(walkDir(filePath));
      else if (filePath.endsWith(".js")) results.push(filePath);
    }
    return results;
  };

  const files = walkDir(baseDir);

  for (const file of files) {
    // Skip file yang ada di folder ./plugins/event/
    if (file.includes(`${path.sep}event${path.sep}`)) continue;

    try {
      const resolvedPath = require.resolve(file);
      if (require.cache[resolvedPath]) delete require.cache[resolvedPath];
      const plugin = require(file);

      if (
        plugin.run &&
        Array.isArray(plugin.run.usage) &&
        typeof plugin.run.category === "string" &&
        typeof plugin.run.async === "function"
      ) {
        plugins.push(plugin.run);
      }
    } catch (err) {
      console.error(`Gagal load plugin ${file}:`, err);
    }
  }
  return plugins;
};

module.exports = async (erlic, m) => {
    const setting = global.db.setting
  const sender = m.key?.fromMe ? (erlic.user.id.split(':')[0]+'@s.whatsapp.net' || erlic.user.id) : (m.key?.participant || m.key?.remoteJid)
  const botNumber = await erlic.decodeJid(erlic.user.id)
const senderNumber = sender.split('@')[0]
const isCreator = (m.sender && ([botNumber, ...global.owner, ...global.prems, ...global.developer, ...setting.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || botNumber.includes(m.sender.replace(/[^0-9]/g, '')))) || false;
const dimasathan = global.owner.includes(m.sender.split('@')[0]);
const prefi = global.db.settings?.prefix || ['.', '!']; // default jika tidak ada
const prefixRegex = new RegExp(`^(${prefi.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);
const pripek = setting.prefix
const budy = (typeof m.text === 'string') ? m.text : '';
const users = global.db.users[m.sender]
const groups = global.db.groups[m.chat]
const func = require('./functions')
const body = m.text || '';
const args = budy.trim().split(/ +/).slice(1)
const tex = q = args.join(" ")
const matchedPrefix = budy.match(prefixRegex);
const prefix = isCreator ? (matchedPrefix ? matchedPrefix[0] : '' ) : (matchedPrefix ? matchedPrefix[0] : pripek ) || pripek || '.';
 // const prefix = global.db.setting.prefix || '!';
 const plugins = await loadPlugins();
    const isPre = (id) => {
  const user = global.db.users[id];
  if (!user || !user.premium) return false;
  const expired = user.expired?.premium;
  if (expired === -1) return true;
  if (typeof expired === 'number' && expired > Date.now()) return true;
  if (typeof expired === 'number' && expired <= Date.now()) {
    user.premium = false;
    user.expired.premium = null;
    return false;
  }
  return false;
};
    const isPrem = isPre(m.sender)
    
    const exceptEvent = [
        '_antihidetag.js',
        '_antilink.js',
        '_stickerwarn.js',
        '_antispam.js',
        '_antitoxic.js',
        '_antiviewonce.js',
        '_antivirtex.js',
        '_antiedited.js',
        '_automatically.js',
        '_response.js',
        '_expiration.js'
    ];
    const events = Object.fromEntries(Object.entries(plugins).filter(([name, prop]) => name))
    for (let name in events) {
            let event = events[name].run;
            if (!event) continue;
        let basename = path.basename(name);
            if (event.main) {
                if (m.isPc && global.blocks.some(no => m.sender.startsWith(no))) return erlic.updateBlockStatus(m.sender, 'block')
                if (!exceptEvent.includes(basename) && users && users.banned && !users.premium && !m.isOwner) continue;
                if (!exceptEvent.includes(basename) && groups && groups.mute && !users.premium && !m.isAdmin && !m.isOwner) continue;
                if (event.owner && !isCreator) continue;
                if (event.group && !m.isGroup) continue;
                if (event.limit && users.limit < 1) continue;
                if (event.botAdmin && !m.isBotAdmin) continue;
                if (event.admin && !m.isAdmin) continue;
                if (event.private && m.isGroup) continue; }}
        
    if (m.isGroup && users && users.afk > 0 && !/protocolMessage|reactionMessage/.test(m.mtype) && !groups.mute) {
            let alasan = `${users.alasan ? users.alasan : 'No reason'}`
            let waktu = `${func.afkTime(new Date - users.afk)}`
            erlic.sendMessageModify(m.chat, `*Alasan :* ${alasan}\n*Selama :* ${waktu}`, m, {
                largeThumb: false,
                title: m.pushName,
                body: 'telah kembali dari AFK',
                thumbUrl: setting.cover,
                url: global.link,
            })
            users.afk = 0;
            users.alasan = '';
        }
    
  const commandText = body.startsWith(prefix) ? body.slice(prefix.length).split(' ')[0].toLowerCase() : null;
  if (!commandText) return;

  if (setting.verify && !global.db.users[m.sender]?.register && !['register','unregister','owner','rules','donate','buyprem','sewabot','harga','suit','tictactoe','werewolf','sticker','menu','menfes','script','jadibot','listbot','stopbot','delsesibot'].includes(commandText) && !isCreator) return erlic.sendMessage(m.chat, { text: `Nomor kamu belum terverifikasi, kirim *${setting.prefix}register*${m.isGroup ? ' di private chat' : ''} untuk verifikasi.` }, { quoted: m });

  for (const plugin of plugins) {
    const allCmd = [
      ...(plugin.usage || []).map(c => c.toLowerCase()),
      ...(plugin.hidden || []).map(c => c.toLowerCase())
    ];
    if (!allCmd.includes(commandText)) continue;

    // Restrictions
    if (plugin.owner && !isCreator) return erlic.reply(m.chat, global.mess.owner, m);
    if (plugin.premium && !m.isPrem && !m.isOwner) return erlic.reply(m.chat, global.mess.premium, m);
    if (plugin.group && !m.isGroup) return erlic.reply(m.chat, global.mess.group, m);
    if (plugin.admin && !m.isAdmin && !m.isOwner) return erlic.reply(m.chat, global.mess.admin, m);
    if (plugin.botAdmin && !m.isBotAdmin) return erlic.reply(m.chat, global.mess.botAdmin, m);
    if (plugin.private && m.isGc) return erlic.reply(m.chat, global.mess.private, m);

    try {
      await plugin.async(m, { erlic, setting: global.db.setting, users: global.db.users[m.sender], groups: global.db.groups[m.chat], plugins, func: require('./functions'), cmd: commandText, command: commandText, froms: m.quoted, prefix: pripek, text: tex, quoted: (m.quoted ? m.quoted : m), froms: m.quoted ? m.quoted.sender : (m.text && m.text.replace(/[^0-9]/g, '') !== '' ? m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false), isCreator: isCreator, isPrem: isPrem });
    } catch (err) {
        await cekError(erlic, m, err, __filename);
      console.error(`Error plugin '${commandText}':`, err);
    }
    break;
  }
};

// 🔥 Nonton folder ./plugins dan subfolder
// ./system/handler.js
const chokidar = require("chokidar")
const chalk = require('chalk')
// const path = require("path")

// Normalisasi path ke folder plugins
const pluginsDir = path.resolve("./plugins")

// Nonton semua file di dalam plugins + subfolder
const watcher = chokidar.watch(pluginsDir + "/**/*.js", {
  persistent: true,
  ignoreInitial: true,
})

// Event perubahan
watcher
  .on("add", file => console.log(
    chalk.greenBright.bold('[ NEW PLUGINS ]'),
    //chalk.whiteBright(moment(Date.now()).format('DD/MM/YY HH:mm:ss')),
    chalk.cyan.bold('➠ ' + file)
  ))
  .on("change", file => {
   // const chalk = require('chalk')
    console.log(
      chalk.greenBright.bold('[ UPDATE ]'),
     // chalk.whiteBright(moment(Date.now()).format('DD/MM/YY HH:mm:ss')),
      chalk.cyan.bold('➠ ' + file)
    )
    delete require.cache[require.resolve(file)] // clear cache
    try {
      require(file) // reload plugin
    } catch (e) {
      console.error(chalk.red("Error reload plugin:", e))
    }
  })
  .on("unlink", file => {
  //  const chalk = require('chalk')
    console.log(
      chalk.redBright.bold('[ DELETE ]'),
     // chalk.whiteBright(moment(Date.now()).format('DD/MM/YY HH:mm:ss')),
      chalk.white.bold('➠ ' + file)
    )
    delete require.cache[require.resolve(file)]
  })
  .on("error", err => console.error("Error chokidar:", err))