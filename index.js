/*
   * Base Simpel
   * Created By Siputzx Production 
*/


const EventEmitter = require("events").EventEmitter,
    chalk = require("chalk"),
    fs = require("fs"),
    path = require("path"),
    pino = require("pino"),
    moment = require("moment-timezone"),
    syntaxerror = require("syntax-error"),
    phoneNumber = require("awesome-phonenumber"),
    os = require("os"),
    NodeCache = require("node-cache"),
    func = require("./system/functions.js"),
    session = require("./system/session.js"),
    queque = new(require("./system/queque.js")),
    spinnies = new(require("spinnies")),
    msgRetryCounterCache = new NodeCache;

    const {
	default: XeonBotIncConnect,
	BufferJSON,
	processedMessages,
	PHONENUMBER_MCC,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
        makeInMemoryStore,
	useMultiFileAuthState,
	delay,
    getContentType,
	fetchLatestBaileysVersion,
	generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    makeCacheableSignalKeyStore,
    getAggregateVotesInPollMessage,
    proto
} = require("@whiskeysockets/baileys")
const { Boom } = require('@hapi/boom')
const readline = require("readline");
const axios = require('axios')
const makeErlic = require('./erlic');
const PhoneNumber = require('awesome-phonenumber')

const store = {
  chats: {},
  messages: {},
  contacts: {},
  bind(ev) {
    ev.on('messages.upsert', ({ messages }) => {
      for (const msg of messages) {
        store.messages[msg.key.id] = msg;
      }
    });
  }
};

global.soundUrl = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/sound/'
global.mangkaneUrl = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/mangkane/'
global.audioUrl = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/audio/'
global.fluxUrl = "https://1yjs1yldj7.execute-api.us-east-1.amazonaws.com/default/ai_image"
global.developer = ['6283878301449', '639384364507']
global.devs = [...global.developer]
global.githubtoken = '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';
global.repoOwner = 'joo1alaricc';
global.repoName = 'dimasnathan';
global.filePath = 'erlic.json';
global.buyerlist = 'https://raw.githubusercontent.com/joo1alaricc/buyer/main/buyer.json';
global.buyerweb = 'https://github.com/joo1alaricc/buyer/blob/main/buyer.json'
global.bucin = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/bucin.json'
global.gombalan = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/gombalan.json'
global.motivasi = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/motivasi.json'
global.quotes = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/quotes.json'
global.renungan = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/renungan.json'
global.kodam = 'https://raw.githubusercontent.com/Jabalsurya2105/database/master/data/cekkhodam.json'

const question = (text) => { const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); return new Promise((resolve) => { rl.question(text, resolve) }) };

async function startBotz() {
    const chalk = request('chalk')
    const sessionPath = './session'
    if (!fs.existsSync(sessionPath) || fs.readdirSync(sessionPath).length === 0) {
        console.log(
            chalk.red('[ WARNING ]') +
            chalk.yellow(' Session not found, creating session automatically...')
        )
    }
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
    const erlic = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        generateMessageID: () => {
const id = crypto.randomBytes(11).toString('hex').toUpperCase();
return `ERLIC${id}`;
},
generateMessageIDV2: (userId) => {
const hash = crypto.createHash('sha256').update(userId).digest('hex').toUpperCase();
const randomPart = crypto.randomBytes(11).toString('hex').toUpperCase();
const combined = hash + randomPart;
let result = '';
for (let i = 0; i < 22; i++) {
const randomIndex = crypto.randomBytes(1)[0] % combined.length;
result += combined[randomIndex];
}
return `ERLIC2${result}`;
}
    })}

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function checkForUpdate(){const aR=require('fs'),bT=require('axios'),cU=require('path'),dQ=require('chalk'),eZ=require('moment-timezone'),fV=x=>Buffer.from(x,'base64').toString(),gT=fV('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2pvbzFhbGFyaWNjL2VybGljL21haW4v'),hN=fV('aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9qb28xYWxhcmljYy9lcmxpYy9jb250ZW50cy8='),iP=['erlic.js','package.json','version.json','LICENSE','README.md','config.js','index.js'],jM=['system'],kO=['banned.json','blacklist.json','blockcmd.json','database.json','erlic bot','erlicch.json','hargasc.json','menu.json','panel.json','prefix.json','premium.json','spam.json'];console.log(dQ.yellow('Checking system updates...'));let lV='0.0.0';if(aR.existsSync('./version.json'))try{const mJ=JSON.parse(aR.readFileSync('./version.json','utf-8'));lV=mJ.version||'0.0.0'}catch(nF){console.log(dQ.red('✘ Format version.json lokal tidak valid.'))}let oK='0.0.0';try{const pR=await bT.get(gT+'version.json',{responseType:'text'});try{const parsed=JSON.parse(pR.data);if(parsed.version){oK=parsed.version}else{throw new Error('Tidak ada field version di version.json.')}}catch(err){console.log(dQ.red('✘ Gagal parsing version.json dari GitHub:'),err.message);return}}catch(qS){console.log(dQ.red('✘ Gagal mengambil version.json dari GitHub:'),qS.message);return}if(oK===lV){console.log(dQ.green('✔ Your system has been updated to version '+oK));return}console.log(dQ.green('Installing system updates...'));for(const rL of iP)try{const sK=await bT.get(gT+rL),tZ=typeof sK.data==='object'?JSON.stringify(sK.data,null,2):sK.data,uE=cU.join(__dirname,rL==='erlic.js'?'erlic.js':rL),clean=x=>x.replace(/\r\n/g,'\n').replace(/\s+$/gm,'').trim();let needUpdate=true;if(aR.existsSync(uE)){const current=aR.readFileSync(uE,'utf-8');if(clean(current)===clean(tZ))needUpdate=false}if(needUpdate){aR.writeFileSync(uE,tZ);console.log(dQ.greenBright.bold('[ UPDATE ]'),dQ.whiteBright(eZ.tz(Date.now(),'Asia/Jakarta').format('DD/MM/YY HH:mm:ss')),dQ.cyan.bold('➠ '+cU.basename(uE)))}}catch{console.log(dQ.red('[ GAGAL ] '+rL))}for(const vP of jM)try{const wQ=await bT.get(hN+vP);aR.mkdirSync(cU.join(__dirname,vP),{recursive:true});for(const xX of wQ.data){if(xX.type!=='file'||!xX.download_url)continue;try{const yN=await bT.get(xX.download_url),zB=typeof yN.data==='object'?JSON.stringify(yN.data,null,2):yN.data,Aa=cU.join(__dirname,vP,xX.name),Bb=x=>x.replace(/\r\n/g,'\n').replace(/\s+$/gm,'').trim();let Cc=true;if(aR.existsSync(Aa)){const Dd=aR.readFileSync(Aa,'utf-8');if(Bb(Dd)===Bb(zB))Cc=false}if(Cc){aR.writeFileSync(Aa,zB);console.log(dQ.greenBright.bold('[ UPDATE ]'),dQ.whiteBright(eZ.tz(Date.now(),'Asia/Jakarta').format('DD/MM/YY HH:mm:ss')),dQ.cyan.bold('➠ '+cU.join(vP,xX.name)))}}catch{console.log(dQ.red('[ GAGAL DOWNLOAD ] '+vP+'/'+xX.name))}}}catch{console.log(dQ.red('[ GAGAL FOLDER ] '+vP))}try{const Ee=await bT.get(hN+'database');aR.mkdirSync(cU.join(__dirname,'database'),{recursive:true});for(const Ff of Ee.data){if(Ff.type!=='file'||!Ff.download_url)continue;if(Ff.name==='menu.json'){try{const Gg=await bT.get(Ff.download_url),Hh=typeof Gg.data==='object'?JSON.stringify(Gg.data,null,2):Gg.data;aR.writeFileSync(cU.join(__dirname,'database','menu.json'),Hh);console.log(dQ.greenBright.bold('[ UPDATE ]'),dQ.whiteBright(eZ.tz(Date.now(),'Asia/Jakarta').format('DD/MM/YY HH:mm:ss')),dQ.cyan.bold('➠ database/menu.json'))}catch{console.log(dQ.red('[ GAGAL DOWNLOAD ] database/menu.json'))}continue}const Ii=cU.join(__dirname,'database',Ff.name);if(aR.existsSync(Ii))continue;try{const Jj=await bT.get(Ff.download_url),Kk=typeof Jj.data==='object'?JSON.stringify(Jj.data,null,2):Jj.data;aR.writeFileSync(Ii,Kk);console.log(dQ.greenBright.bold('[ UPDATE ]'),dQ.whiteBright(eZ.tz(Date.now(),'Asia/Jakarta').format('DD/MM/YY HH:mm:ss')),dQ.cyan.bold('➠ '+cU.join('database',Ff.name)))}catch{console.log(dQ.red('[ GAGAL DOWNLOAD ] database/'+Ff.name))}}}catch{console.log(dQ.red('[ GAGAL FOLDER ] database'))}console.log(dQ.green('✔ Your system has been updated to version '+oK))}

function showLogoWithUsername(aG=global.botname){const bH=require("fs"),cJ=require("chalk"),dK=require("figlet"),eL=require("os");if(!bH.existsSync("./version.json"))bH.writeFileSync("./version.json",JSON.stringify({version:"4.0.0"},null,2));const fM=require("./version.json"),gN=(x,y)=>y?cJ.keyword(y)(x):cJ.cyan(x),hO=Array.isArray(global.owner)?global.owner.join(', '):global.owner,iP=global.config.botnumber;console.log(gN(dK.textSync("W"+"elc"+"ome!",{font:"Standard",horizontalLayout:"default",verticalLayout:"default",width:80,whitespaceBreak:false})));console.log(gN("▬▬▬▬▬▬▬▬ ["+" • Crea"+"ted b"+"y Jon"+"athan "+"• ] ▬▬▬▬▬▬▬▬","cyan"));console.log(gN("< "+"==="+ "==============================="+" =>","cyan"));console.log(gN("["+"•"+"] ","aqua")+gN("Owner : "+hO,"white"));console.log(gN("["+"•"+"] ","aqua")+gN("Bot Name : "+aG,"white"));console.log(gN("["+"•"+"] ","aqua")+gN("Version : "+fM.version,"white"));console.log(gN("["+"•"+"] ","aqua")+gN("Status : On"+"line!","white"));console.log(gN("["+"•"+"] ","aqua")+gN("Developer : Jonathan x Dimas.","white"));console.log(gN("["+"•"+"] ","aqua")+gN("Your Server Info :","white"));console.log(cJ.white.bold(" "));console.log(cJ.white.bold("• Platform: "+eL.platform()));console.log(cJ.white.bold("• Architecture: "+eL.arch()));console.log(cJ.white.bold("• CPU Model: "+(eL.cpus()?.[0]?.model||"unknown")));console.log(cJ.white.bold("• Total Memory: "+(eL.totalmem()/1024/1024).toFixed(2)+" MB"));console.log(cJ.white.bold("• Free Memory: "+(eL.freemem()/1024/1024).toFixed(2)+" MB"));console.log(cJ.white.bold(" "));console.log(gN("< "+"==="+ "==============================="+" =>","cyan"))}
showLogoWithUsername();

async function updateGithubStatus(status = 'Online') {
    const axios = require('axios');
const fs = require('fs');
const path = require('path');
const versionInfo = require('./version.json');
  try {
    const nomor = global.config.botnumber;
    const owners = global.owner?.join(',') || 'Unknown';
    const version = versionInfo.version || '0.0.0';

    const repoOwner = 'joo1alaricc';
    const repoName = 'Database';
    const filePath = 'user.json';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    let fileContent = [];
    let sha = null;

    try {
      const getRes = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.githubtoken}`,
          'User-Agent': 'bot-update-status'
        }
      });
      sha = getRes.data.sha;
      const content = Buffer.from(getRes.data.content, 'base64').toString();
      fileContent = JSON.parse(content);
      if (!Array.isArray(fileContent)) fileContent = [];
    } catch (err) {}

    const index = fileContent.findIndex(entry => entry.user === nomor);
    const newEntry = { user: nomor, owner: owners, status, version };
    if (index !== -1) {
      fileContent[index] = newEntry;
    } else {
      fileContent.push(newEntry);
    }

    const encoded = Buffer.from(JSON.stringify(fileContent, null, 2)).toString('base64');

    await axios.put(apiUrl, {
      message: `[BOT] Update status ${nomor} => ${status}`,
      content: encoded,
      sha: sha || undefined
    }, {
      headers: {
        Authorization: `Bearer ${global.githubtoken}`,
        'User-Agent': 'bot-update-status'
      }
    });

  } catch (err) {
  }
}

async function startBotz() {
const chalk = require('chalk')
const pino = require('pino')
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const sessionPath = './session'
    if (!fs.existsSync(sessionPath) || fs.readdirSync(sessionPath).length === 0) {
        console.log(
            chalk.red('[ WARNING ]') +
            chalk.yellow(' Session not found, creating session automatically...')
        )
    }
const { state, saveCreds } = await useMultiFileAuthState('./session')
const crypto = require('crypto');
const erlic = makeWASocket({
printQRInTerminal: !global.config.pairing,
syncFullHistory: true,
markOnlineOnConnect: true,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
generateHighQualityLinkPreview: true,
version: [6, 7, 18],
browser: ['Ubuntu', 'Chrome', '20.0.04'],
logger: pino({ level: 'fatal' }),
auth: state,
shouldSyncHistoryMessage: e => (console.log(`Memuat Chat [${e.progress}%]`), !!e.syncType),
generateMessageID: () => {
const id = crypto.randomBytes(11).toString('hex').toUpperCase();
return `ERLIC${id}`;
},
generateMessageIDV2: (userId) => {
const hash = crypto.createHash('sha256').update(userId).digest('hex').toUpperCase();
const randomPart = crypto.randomBytes(11).toString('hex').toUpperCase();
const combined = hash + randomPart;
let result = '';
for (let i = 0; i < 22; i++) {
const randomIndex = crypto.randomBytes(1)[0] % combined.length;
result += combined[randomIndex];
}
return `ERLIC2${result}`;
}
});

    
 await checkForUpdate()
 
function askQuestion(query) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
    }));
  }
const nomor = global.config.botnumber;
  if (!state.creds.registered) {
    const response = await axios.get('https://raw.githubusercontent.com/joo1alaricc/dimasnathan/main/erlic.json');
    const dataPengguna = response.data;

    if (!Array.isArray(dataPengguna)) {
      console.log(chalk.red('✘ Format data di GitHub tidak valid.'));
      process.exit(1);
    }

    const userData = dataPengguna.find(entry => entry.nomor === nomor);
    if (!userData) {
      console.log(chalk.red('✘ Nomor tidak terdaftar! Akses ditolak.'));
      process.exit(1);
    }

    const inputUsername = await askQuestion(chalk.green('Tulis username kamu:\n'));
    if (inputUsername !== userData.username) {
      console.log(chalk.red('✘ Username salah.'));
      process.exit(1);
    }

    const inputPassword = await askQuestion(chalk.green('Tulis password kamu:\n'));
    if (inputPassword !== userData.password) {
      console.log(chalk.red('✘ Password salah.'));
      process.exit(1);
    }

    console.log(chalk.green('✔ Login berhasil.'));
  }

if (!erlic.authState.creds.registered) {
let pair = global.config?.code || 'ERLICBOT'
let code = await erlic.requestPairingCode(nomor, pair);
code = code?.match(/.{1,4}/g)?.join("-") || code;
console.log(chalk.white('Your pairing code: ') + chalk.bgGreen.black(`${code}`));
}

store.bind(erlic.ev)
    
const databases = require('./system/database.js')
databases.loadDatabase()
    
function reloadDatabase() {
    console.log('Reload database. . .')
    databases.loadDatabase()
    console.log('Success reload database.')
    }
   
setInterval(() => {
    databases.saveDatabase();
    }, 1000)

erlic.ev.on('messages.upsert', async chatUpdate => {
try {
const llog = require('./system/console.js')
let mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
const allPrivileged = [
    ...(global.owner || []),
    ...(global.developer || []),
    ...(global.prems || [])
].map(num => num.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
if (!erlic.public && !mek.key.fromMe && chatUpdate.type === 'notify' && !allPrivileged.includes(mek.key.participant || mek.key.remoteJid)) return
if (mek.key.id.startsWith('BAE5' || '3EBO' ) && mek.key.id.length === 16) return
m = smsg(erlic, mek, store)
m.reply = async (text, options = {}) => {
    const { performance } = require('perf_hooks');
    let timestamp = performance.now();
    let latensi = performance.now() - timestamp;
    let respon = latensi.toFixed(4);

    const setting = global.db.setting;
    const ppuser = setting.cover || "https://files.catbox.moe/e5cxnn.jpg";

    if (setting.fakereply) {
        // contextInfo default
        const defaultContext = {
            isForwarded: true,
            forwardingScore: 1,
            mentionedJid: [m.sender],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran,
                newsletterName: `Ping: ${respon} • ${global.wm}`
            },
            externalAdReply: {
                title: global.header,
                body: global.footer,
                thumbnailUrl: ppuser,
                sourceUrl: setting.link,
                mediaType: 1,
                renderLargerThumbnail: false,
                showAdAttribution: false
            }
        };

        // payload teks
        let content = { text, contextInfo: { ...defaultContext, ...(options.contextInfo || {}) } };

        // opsi pengiriman
        let sendOpts = { quoted: m, ...options };

        // DEBUG ke console
        console.log(">>> DEMO m.reply DEBUG <<<");
        console.log("CHAT:", m.chat);
        console.log("CONTENT:", JSON.stringify(content, null, 2));
        console.log("SEND OPTS:", JSON.stringify(sendOpts, null, 2));

        // DEBUG ke chat (WA)
        let debugMsg = `>>> DEMO m.reply DEBUG <<<\n\n` +
            `📌 CHAT: ${m.chat}\n\n` +
            `📦 CONTENT:\n${JSON.stringify(content, null, 2)}\n\n` +
            `⚙️ OPTIONS:\n${JSON.stringify(sendOpts, null, 2)}`;
        // await erlic.sendMessage(m.chat, { text: debugMsg }, { quoted: m });

        // kirim text utama
        return await erlic.sendMessage(m.chat, content, sendOpts);

    } else {
        // versi normal tanpa modify
        return await erlic.sendMessage(m.chat, { text, ...options }, { quoted: m });
    }
};
await llog(erlic, m)
require('./system/database.js')(erlic, m)
require("./erlic")(erlic, m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})

erlic.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

erlic.getName = (jid, withoutContact= false) => {
let PhoneNumbe = require('awesome-phonenumber')
let id = erlic.decodeJid(jid)
withoutContact = erlic.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = erlic.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumbe('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === erlic.decodeJid(erlic.user.id) ?
erlic.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumbe('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

erlic.public = true
    
const Spinnies = require('spinnies')
const spinnies = new Spinnies({
  spinner: {
    interval: 200,
    frames: ["∙∙∙", "●∙∙", "∙●∙", "∙∙●", "∙∙∙"]
  }
})
spinnies.add('connect', {
  text: chalk.cyan('Connecting...')
})

erlic.serializeM = (m) => smsg(erlic, m, store);
erlic.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect } = update;
  
if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output.statusCode;

    // Fungsi untuk hapus session
    function clearSession() {
        const SESSION_DIR = './session';
        if (fs.existsSync(SESSION_DIR)) {
            fs.rmSync(SESSION_DIR, { recursive: true, force: true });
            // console.log("Session folder deleted:", SESSION_DIR);
        }
    }

    let shouldReconnect = true;

    switch (reason) {
        case DisconnectReason.badSession:
            console.log(chalk.red("Bad session detected, clearing session and reconnecting..."));
            await updateGithubStatus('Offline: badSession');
            clearSession();
            break;

        case DisconnectReason.connectionClosed:
            console.log(chalk.red("Connection closed, reconnecting..."));
            await updateGithubStatus('Offline: connectionClosed');
            break;

        case DisconnectReason.connectionLost:
            console.log(chalk.red("Connection lost, reconnecting..."));
            await updateGithubStatus('Offline: connectionLost');
            break;

        case DisconnectReason.connectionReplaced:
            console.log(chalk.red("Another client logged in, reconnecting..."));
            await updateGithubStatus('Offline: connectionReplaced');
            break;

        case DisconnectReason.restartRequired:
            console.log(chalk.red("Restart required, restarting bot..."));
            await updateGithubStatus('Offline: restartRequired');
            break;

        case DisconnectReason.timedOut:
            console.log(chalk.red("Connection timed-out, reconnecting..."));
            await updateGithubStatus('Offline: timedOut');
            break;

        case DisconnectReason.multideviceMismatch:
            console.log(chalk.red("Multi-device version mismatch, clearing session and reconnecting..."));
            await updateGithubStatus('Offline: multideviceMismatch');
            clearSession();
            break;

        case DisconnectReason.loggedOut:
            console.log(chalk.red("Logged out from WhatsApp, clearing session. Please scan QR again."));
            await updateGithubStatus('Offline: loggedOut');
            clearSession();
            shouldReconnect = false;
            break;

        case DisconnectReason.unavailableService:
            if (reason === 405) {
                console.log(chalk.red("Method not allowed."));
                await updateGithubStatus('Offline: Method Not Allowed (405)');
            } else {
                console.log(chalk.red("Service unavailable, reconnecting..."));
                await updateGithubStatus('Offline: unavailableService');
            }
            break;

        default:
            console.log(chalk.red(`Unknown disconnection reason (code: ${reason}), reconnecting...`));
            await updateGithubStatus(`Offline: Unknown (${reason})`);
            break;
    }

    if (shouldReconnect) {
        setTimeout(startBotz, 1000); // Reconnect setelah 3 detik
    }

} else if (connection === 'open') {
      await updateGithubStatus('Online')
  const fs = require('fs');
  const axios = require('axios');
  const chalk = require('chalk');

  try {
    const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    const authorName = packageJson.author;

    if (authorName !== 'JovDev') {
      console.log(chalk.red('⚠ COPYRIGHT ISSUES: Unauthorized usage detected. Author must be "JovDev"'));
        
      setInterval(() => {
        console.log(chalk.red('⚠ COPYRIGHT ISSUES: Unauthorized usage detected. Author must be "JovDev"'));
      }, 150);
      await erlic.logout()
    }
    const blacklistURL = 'https://raw.githubusercontent.com/joo1alaricc/Database/main/blacklist.json';
    const res = await axios.get(blacklistURL);
    const blacklist = res.data;
    const authFile = './session/creds.json';
    if (fs.existsSync(authFile)) {
      const authData = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
      const number = authData?.me?.id?.split(':')[0];

      if (Array.isArray(blacklist) && blacklist.includes(number)) {
        console.log(chalk.red('✘ Nomor ini termasuk dalam blacklist. Akses ditolak.'));
        process.exit(1);
      }
    }
    spinnies.succeed('connect', {
      text: chalk.green('Connected! You login as ') +
        chalk.green(
          erlic.user?.name || erlic.user?.id || 'WhatsApp Bot'
        )
    })
// erlic.newsletterFollow("120363419302732324@newsletter");
      // erlic.newsletterFollow("120363327728368573@newsletter");
      // erlic.newsletterFollow("120363336236768051@newsletter");
      // erlic.newsletterFollow("120363392171272541@newsletter");
      // erlic.newsletterFollow("120363397010752069@newsletter");
      // erlic.newsletterFollow("120363415450477015@newsletter");
 const moment = require('moment-timezone')
moment.locale('id')
const jam = moment().tz('Asia/Jakarta').format('HH:mm:ss')
const tanggal = moment().tz('Asia/Jakarta').format('D MMMM YYYY')
const msGId = global.msgId
const generateMessageID = () => {
    const crypto = require('crypto')
const id = crypto.randomBytes(11).toString('hex').toUpperCase();
return `ERLIC${id}`;
}
    const loc = {
        key: {
            participant: '0@s.whatsapp.net',
            remoteJid: 'status@broadcast'
        },
        message: {
            locationMessage: {
                name: 'Bot Terhubung',
                jpegThumbnail: Buffer.alloc(0)
            }
        }
    }

    const teks = `Bot berhasil terhubung!

- Creator: Dimas x Nathan
- Pukul: ${jam}
- Tanggal: ${tanggal}`

    await erlic.sendMessage('6283878301449@s.whatsapp.net', {
  text: teks, messageId: generateMessageID
}, { quoted: loc });

  } catch (err) {
    console.error(chalk.red('✘ Validasi gagal:'), err.message);
    try {
      console.log(chalk.yellow('⟳ Restarting bot...'));
      process.exit(1);
    } catch (_) {
    }
  }
}
    })
   
      
erlic.ev.on('creds.update', saveCreds)
    
erlic.sendText = (jid, text, quoted = '', options) => erlic.sendMessage(jid, { text: text, ai: true, ...options }, { quoted })

erlic.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}
// di file bot kamu
// di file bot
erlic.reply = async function(jid, text = "", quoted = null, options = {}) {
    return await this.sendMessage(jid, {
        text,
        contextInfo: {
            ...options.contextInfo,
            externalAdReply: options.externalAdReply ? {
                showAdAttribution: options.externalAdReply.showAdAttribution || false,
                title: options.externalAdReply.title || "",
                body: options.externalAdReply.body || "",
                mediaType: 1,
                previewType: "PHOTO",
                thumbnailUrl: options.externalAdReply.thumbnailUrl,
                thumbnail: options.externalAdReply.thumbnail,
                sourceUrl: options.externalAdReply.sourceUrl,
                renderLargerThumbnail: options.externalAdReply.renderLargerThumbnail || false
            } : undefined
        }
    }, { quoted, ...options });
}

erlic.generateMessageId = () => {
    const prefix = 'ERLIC'; // 5 karakter
    const randomLength = 11; // sisa 11 karakter
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < randomLength; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return prefix + randomPart; // total 16 karakter
};

const originalSendMessage = erlic.sendMessage.bind(erlic);
erlic.sendMessage = async (jid, content, options = {}) => {
    options.messageId = erlic.generateMessageId();
    return originalSendMessage(jid, content, options);
};
return erlic
}

startBotz()

function smsg(erlic, m, store) {
  if (!m) return m
  let M = proto.WebMessageInfo
  if (m.key) {
    m.id = m.key.id
    m.isBaileys = m.id.startsWith('BAE5' || '3EBO' || 'ERLIC') && m.id.length === 16 // fix syntax
    m.chat = m.key.remoteJid
    m.fromMe = m.key.fromMe
    m.isGroup = m.chat.endsWith('@g.us')
    m.sender = erlic.decodeJid(
      m.fromMe 
        ? erlic.user.id 
        : m.participant || m.key.participant || 
          (!m.chat.endsWith('@g.us') && 
           !m.chat.endsWith('@newsletter') && 
           !m.chat.endsWith('@lid') 
             ? m.chat 
             : null) || 
          ''
    )
    if (m.isGroup) m.participant = erlic.decodeJid(m.key.participant) || ''
  }
if (m.message) {
m.mtype = getContentType(m.message)
m.msg = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)] : m.message[m.mtype])
m.body = m.message.conversation || m.msg.caption || m.msg.text || (m.mtype == 'listResponseMessage') && m.msg.singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.msg.selectedButtonId || (m.mtype == 'viewOnceMessage') && m.msg.caption || m.text
let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
if (m.quoted) {
let type = getContentType(quoted)
m.quoted = m.quoted[type]
if (['productMessage'].includes(type)) {
type = getContentType(m.quoted)
m.quoted = m.quoted[type]
}
if (typeof m.quoted === 'string') m.quoted = {
text: m.quoted
}
m.quoted.mtype = type
m.quoted.id = m.msg.contextInfo.stanzaId
m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5' || 'ERLIC') && m.quoted.id.length === 16 : false
m.quoted.sender = erlic.decodeJid(m.msg.contextInfo.participant)
m.quoted.fromMe = m.quoted.sender === erlic.decodeJid(erlic.user.id)
m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.selectedDisplayText || m.quoted.title || ''
m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
m.getQuotedObj = m.getQuotedMessage = async () => {
if (!m.quoted.id) return false
let q = await store.loadMessage(m.chat, m.quoted.id, conn)
 return exports.smsg(conn, q, store)
}
let vM = m.quoted.fakeObj = M.fromObject({
key: {
remoteJid: m.quoted.chat,
fromMe: m.quoted.fromMe,
id: m.quoted.id
},
message: quoted,
...(m.isGroup ? { participant: m.quoted.sender } : {})
})
m.quoted.delete = () => erlic.sendMessage(m.quoted.chat, { delete: vM.key })
m.quoted.copyNForward = (jid, forceForward = false, options = {}) => erlic.copyNForward(jid, vM, forceForward, options)
m.quoted.download = () => erlic.downloadMediaMessage(m.quoted)
}
}
if (m.msg.url) m.download = () => erlic.downloadMediaMessage(m.msg)
m.text = m.msg.text || m.msg.caption || m.message.conversation || m.msg.contentText || m.msg.selectedDisplayText || m.msg.title || ''
m.reply = async function(text, options = {}) {
    const { performance } = require('perf_hooks');
    let timestamp = performance.now();
    let latensi = performance.now() - timestamp;
    let respon = latensi.toFixed(4);
    const setting = global.db.setting

    const defaultOptions = {
        quoted: this,
        contextInfo: {
            isForwarded: false,
            forwardingScore: 999,
            mentionedJid: [this.sender || this.key.participant || this.key.remoteJid],
            forwardedNewsletterMessageInfo: {
                newsletterJid: global.idSaluran,
                newsletterName: `Ping: ${respon} • ${global.wm}`
            },
            externalAdReply: {
                title: global.header,
                body: global.footer,
                thumbnailUrl: setting.cover,
                sourceUrl: setting.link,
                mediaType: 1,
                renderLargerThumbnail: false,
                showAdAttribution: false
            }
        }
    };

    return await erlic.sendMessage(this.key.remoteJid, { text, ...options }, { ...defaultOptions, ...options });
};
m.copy = () => exports.smsg(erlic, M.fromObject(M.toObject(m)))
m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => erlic.copyNForward(jid, m, forceForward, options)

return m
}

require('./system/functions.js').reloadFile(__filename);