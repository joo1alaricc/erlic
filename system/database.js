const fs = require('fs');
const path = require('path');
const toMs = require('ms');
const chalk = require('chalk')
const func = require('./functions.js');
const dbPath = path.join(__dirname, '../database/database.json');
global.db = {
users: {},
groups: {},
setting: {}
};
function loadDatabase() {
try {
if (fs.existsSync(dbPath)) {
const data = fs.readFileSync(dbPath, 'utf-8');
const loaded = JSON.parse(data);
if (loaded.users) global.db.users = loaded.users;
if (loaded.groups) global.db.groups = loaded.groups;
if (loaded.setting) global.db.setting = loaded.setting;
console.log('Successfully reload database.');
}
} catch (err) {}
}
function saveDatabase() {
try {
const data = JSON.stringify(global.db, null, 2);
fs.writeFileSync(dbPath, data, 'utf-8');
} catch (err) {}
}
module.exports = (erlic, messages) => {
try {
if (!messages.message) return;
if (messages.key && messages.key.remoteJid === 'status@broadcast') return;
const isNumber = x => typeof x === 'number' && !isNaN(x);
const chatId = messages.key.remoteJid;
const botId = erlic.user.id ? erlic.user.id.split(':')[0] + '@s.whatsapp.net' : erlic.user.jid;
const userId = messages.key.fromMe ? botId : messages.key.participant || messages.key.remoteJid;
const pushname = messages.pushName || '-';
const expired = Date.now() + toMs('7d');
const calender = new Date().toLocaleDateString('id', { day: 'numeric', month: 'long', year: 'numeric' });
// User
if (userId.endsWith('@s.whatsapp.net')) {
let users = global.db.users[userId];
if (typeof users !== 'object') global.db.users[userId] = {};
if (users) {
if (!('banned' in users)) users.banned = false;
if (!isNumber(users.warning)) users.warning = 0;
if (!('expired' in users)) users.expired = { user: expired, premium: 0, banned: 0 };
if (!isNumber(users.lastunreg)) users.lastunreg = 0;
if (!isNumber(users.exp)) users.exp = 0;
if (!isNumber(users.level)) users.level = 0;
if (!('role' in users)) users.role = 'Bronze';
} else {
global.db.users[userId] = {
jid: userId,
register: false,
name: pushname,
gender: '',
age: 0,
date: calender,
limit: 15,
balance: 10000,
premium: false,
banned: false,
warning: 0,
expired: { user: expired, premium: 0, banned: 0 },
lastunreg: 0,
exp: 0,
level: 0,
role: 'Bronze'
};
}
}
// Group
if (chatId.endsWith('@g.us')) {
let groups = global.db.groups[chatId];
if (typeof groups !== 'object') global.db.groups[chatId] = {};
if (groups) {
if (!('jid' in groups)) groups.jid = chatId;
if (!('name' in groups)) groups.name = '-';
if (!('blacklist' in groups)) groups.blacklist = [];
if (!('member' in groups)) groups.member = [];
} else {
global.db.groups[chatId] = { 
jid: chatId, 
name: '-', 
blacklist: [], 
member: [] };
}
}
// Sistem
let settings = global.db.setting;
if (typeof settings !== 'object') global.db.setting = {};
if (settings) {
if (!('prefix' in settings)) settings.prefix = '.';
if (!('owner' in settings)) settings.owner = [...global.owner, ...global.devs, ...global.prems];
if (!('packname' in settings)) settings.packname = 'Created by Erlic Bot\n+week, +date\n+time';
if (!('author' in settings)) settings.author = '';
if (!('cover' in settings)) settings.cover = global.thumb
if (!('link' in settings)) settings.link = global.link
if (!isNumber(settings.style)) settings.style = 1;
if (!('autobio' in settings)) settings.autobio = false;
if (!('autoread' in settings)) settings.autoread = false;
if (!('antispam' in settings)) settings.antispam = false;
if (!('autorecord' in settings)) settings.autorecord = false;
if (!('autotyping' in settings)) settings.autotyping = false;
if (!('gconly' in settings)) settings.gconly = false 
if (!('online' in settings)) settings.online = false
if (!('menu' in settings)) settings.menu = 1
if (!('menus' in settings)) settings.menus = 1
if (!('video' in settings)) settings.video = 'https://files.catbox.moe/5duc9k.mp4'
if (!('delayJpm' in settings)) settings.delayJpm = 5
if (!('cooldown' in settings)) settings.cooldown = 2
if (!('verify' in settings)) settings.verify = true
if (!('style' in settings)) settings.style = 38
if (!isNumber(settings.limit)) settings.limit = 15;
if (!isNumber(settings.hargalimit)) settings.hargalimit = 1000;
if (!('hargasc' in settings)) settings.hargasc = 35000;
if (!('lastBackup' in settings)) settings.lastBackup = 0;
if (!('blockcmd' in settings)) settings.blockcmd = [];
if (!('toxic' in settings)) settings.toxic = ['ajg', 'anjink', 'anjg', 'anjk', 'anjim', 'anjing', 'anjrot', 'anying', 'asw', 'autis', 'babi', 'bacod', 'bacot', 'bagong', 'bajingan', 'bangsad', 'bangsat', 'bastard', 'bego', 'bgsd', 'biadab', 'biadap', 'bitch', 'bngst', 'bodoh', 'bokep', 'cocote', 'coli', 'colmek', 'comli', 'dajjal', 'dancok', 'dongo', 'fuck', 'goblog', 'goblok', 'guoblog', 'guoblok', 'henceut', 'idiot', 'jancok', 'jembut', 'jingan', 'kafir', 'kanjut', 'keparat', 'kntl', 'kontol', 'lonte', 'meki', 'memek', 'ngentod', 'ngentot', 'ngewe', 'ngocok', 'ngtd', 'njeng', 'njing', 'njinx', 'pantek', 'pantek', 'peler', 'pepek', 'pler', 'pucek', 'puki', 'pukimak', 'setan', 'silit', 'telaso', 'tempek', 'tete', 'titit', 'toket', 'tolol', 'tomlol']
} else {
global.db.setting = {
owner: [...global.owner, ...global.devs, ...global.prems],
packname: 'Created by Erlic Bot\n+week, +date\n+time',
author: '',
cover: global.thumb,
link: global.link,
style: 38,
limit: 15,
hargasc: 35000,
lastBackup: 0,
antispam: false,
autobio: false,
autoread: false,
autorecord: false,
autotyping: false,
gconly: false,
online: false,
verify: true,
delayJpm: 5,
cooldown: 2,
menu: 1,
menus: 1,
video: global.video,
hargalimit: 1000,
blockcmd: [],
toxic: ['ajg', 'anjink', 'anjg', 'anjk', 'anjim', 'anjing', 'anjrot', 'anying', 'asw', 'autis', 'babi', 'bacod', 'bacot', 'bagong', 'bajingan', 'bangsad', 'bangsat', 'bastard', 'bego', 'bgsd', 'biadab', 'biadap', 'bitch', 'bngst', 'bodoh', 'bokep', 'cocote', 'coli', 'colmek', 'comli', 'dajjal', 'dancok', 'dongo', 'fuck', 'goblog', 'goblok', 'guoblog', 'guoblok', 'henceut', 'idiot', 'jancok', 'jembut', 'jingan', 'kafir', 'kanjut', 'keparat', 'kntl', 'kontol', 'lonte', 'meki', 'memek', 'ngentod', 'ngentot', 'ngewe', 'ngocok', 'ngtd', 'njeng', 'njing', 'njinx', 'pantek', 'pantek', 'peler', 'pepek', 'pler', 'pucek', 'puki', 'pukimak', 'setan', 'silit', 'telaso', 'tempek', 'tete', 'titit', 'toket', 'tolol', 'tomlol'],
};
}
} catch (err) {
console.error(err);
}
};
module.exports.loadDatabase = loadDatabase;
module.exports.saveDatabase = saveDatabase;