const { formatNumber, truncateText } = require('../utils/format');
const { getResultData } = require('../utils/result');

const formatList = (items) =>
  items
    .map(
      (proc, index) =>
        `${index + 1}. ${truncateText(proc.name, 20)} (pid ${proc.pid}) - ${formatNumber(
          proc.cpuUsage,
          1
        )}%`
    )
    .join('\n');

module.exports = {
  name: 'topcpu',
  description: 'Show top CPU processes',
  usage: '!topcpu 5',
  async execute({ message, osu, args }) {
    const limit = Number.parseInt(args[0] || '5', 10);
    const topResult = await osu.process.topByCpu(Number.isFinite(limit) ? limit : 5);
    const topList = getResultData(topResult);

    if (!topList || topList.length === 0) {
      await message.reply('No CPU process data available.');
      return;
    }

    await message.reply(`Top CPU processes:\n${formatList(topList)}`);
  }
};
