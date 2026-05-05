const { formatNumber } = require('../utils/format');
const { getResultData } = require('../utils/result');

module.exports = {
  name: 'load',
  description: 'Show system load averages',
  usage: '!load',
  async execute({ message, osu }) {
    const loadResult = await osu.system.load();
    const loadInfo = getResultData(loadResult);

    if (!loadInfo) {
      await message.reply('Load information is unavailable.');
      return;
    }

    const loadText = `${formatNumber(loadInfo.load1)} / ${formatNumber(
      loadInfo.load5
    )} / ${formatNumber(loadInfo.load15)}`;

    const statusText = loadInfo.status ? ` (${loadInfo.status})` : '';
    await message.reply(`Load (1/5/15): ${loadText}${statusText}`);
  }
};
