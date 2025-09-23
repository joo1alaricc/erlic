exports.run = {
  usage: ['verify'],
  category: 'owner',
  owner: true, // only owner can use
  async: async (m, { erlic, text, setting, cmd, pripek }) => {
    const input = text?.toLowerCase?.() || '';

    if (input === 'on') {
      setting.verify = true;
      return erlic.sendMessage(m.chat, { text: 'Verification has been successfully enabled.' }, { quoted: m });
    } else if (input === 'off') {
      setting.verify = false;
      return erlic.sendMessage(m.chat, { text: 'Verification has been successfully disabled.' }, { quoted: m });
    } else {
      return erlic.sendMessage(m.chat, { text: `Current verification status: ${setting.verify ? 'enabled' : 'disabled'}\n\nUsage example: ${pripek + cmd} on/off` }, { quoted: m });
    }
  },
  limit: false,
  location: 'plugins/owner/verify.js'
};