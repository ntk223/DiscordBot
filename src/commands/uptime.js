const { formatNumber } = require('../utils/format');
const { getResultData } = require('../utils/result');

module.exports = {
  name: 'uptime',
  description: 'Show system uptime and boot time',
  usage: '!uptime',
  async execute({ message, osu }) {
    const uptimeResult = await osu.system.uptime();
    const uptimeInfo = getResultData(uptimeResult);

    if (!uptimeInfo) {
      await message.reply('Uptime information is unavailable.');
      return;
    }

    const hours = uptimeInfo.uptime / (1000 * 60 * 60);
    await message.reply(
      `Uptime: ${uptimeInfo.uptimeFormatted} (${formatNumber(hours, 2)} hours)`
    );
  }
};
