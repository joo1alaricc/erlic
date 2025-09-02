

const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const xpCooldownDB = new Set();
const isGained = (userId) => xpCooldownDB.has(userId);
const addCooldown = (userId) => {
    xpCooldownDB.add(userId);
    setTimeout(() => xpCooldownDB.delete(userId), 1000 * 60); 
};

module.exports = async function autolevelup(erlic, m, setting, groups) {
    if (!global.db?.users) return;
    const user = global.db.users[m.sender];
    if (
        !user ||
        !user.register ||
        !setting.autolevelup ||
        isGained(m.sender) ||
        user.level >= 1000 ||
        m.fromMe
    ) return;

    if (!m.isPc && m.isGc && groups?.mute) return;
    if (m.isPrefix) return;

    const currentLevel = user.level;
    const gainedXp = Math.floor(Math.random() * 16) + 20; 
    const requiredXp = 10 * Math.pow(currentLevel, 2) + 50 * currentLevel + 100;

    user.exp = (user.exp || 0) + gainedXp;
    addCooldown(m.sender);

    if (user.exp < requiredXp) return;
    user.level += 1;
    const newLevel = user.level;
    const username = m.pushName || 'Player';

    const text = `Selamat 🥳, anda telah naik level!\n\n*Level Up : ${currentLevel} → ${newLevel}*\n_semakin sering berinteraksi dengan bot semakin tinggi level kamu_`;

    try {
        let backgroundUrl = setting.cover;
        if (!backgroundUrl) backgroundUrl = 'https://i.ibb.co.com/2jMjYXK/IMG-20250103-WA0469.jpg'; 
        const backgroundImage = await loadImage(backgroundUrl).catch(() => null);
        let finalBackgroundUrl = backgroundUrl;

        if (backgroundImage) {
            const canvas = createCanvas(800, 450);
            const ctx = canvas.getContext('2d');
            const imgRatio = backgroundImage.width / backgroundImage.height;
            const targetRatio = 16 / 9;
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

            if (imgRatio > targetRatio) {
                drawHeight = backgroundImage.height;
                drawWidth = drawHeight * targetRatio;
                offsetX = (backgroundImage.width - drawWidth) / 2;
            } else {
                drawWidth = backgroundImage.width;
                drawHeight = drawWidth / targetRatio;
                offsetY = (backgroundImage.height - drawHeight) / 2;
            }

            ctx.drawImage(
                backgroundImage,
                offsetX, offsetY, drawWidth, drawHeight,
                0, 0, 800, 450
            );

            finalBackgroundUrl = canvas.toBuffer('image/jpeg', { quality: 0.9 });
        }
        let avatarUrl;
        try {
            avatarUrl = await erlic.profilePictureUrl(m.sender, 'image');
        } catch {
            avatarUrl = 'https://telegra.ph/file/0a70ee52eb457fbcc2b92.jpg';
        }
        const backgroundEncoded = encodeURIComponent(backgroundUrl);
        const avatarEncoded = encodeURIComponent(avatarUrl);
        const nameEncoded = encodeURIComponent(username);
        const apiUrl = `https://api.siputzx.my.id/api/canvas/level-up?backgroundURL=${backgroundEncoded}&avatarURL=${avatarEncoded}&fromLevel=${currentLevel}&toLevel=${newLevel}&name=${nameEncoded}`;
        await erlic.sendMessage(m.chat, {
            image: { url: apiUrl },
            caption: text,
            ...(m.expiration ? { expiration: m.expiration } : {})
        }, { quoted: m });

    } catch (e) {
        console.error('[LevelUp API Error]', e);
        await m.reply(text);
    }
};