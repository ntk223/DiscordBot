const { formatBytes, truncateText } = require('../utils/format');
const { getResultData } = require('../utils/result');

const formatList = (items) =>
  items
    .map(
      (proc, index) =>
        `${index + 1}. ${truncateText(proc.name, 20)} (pid ${proc.pid}) - ${formatBytes(
          proc.memoryUsage
        )}`
    )
    .join('\n');

module.exports = {
  name: 'topmem',
  description: 'Show top memory processes',
  usage: '!topmem 5',
  async execute({ message, osu, args }) {
    const limit = Number.parseInt(args[0] || '5', 10);
    const topResult = await osu.process.topByMemory(
      Number.isFinite(limit) ? limit : 5
    );
    const topList = getResultData(topResult);

    if (!topList || topList.length === 0) {
      await message.reply('No memory process data available.');
      return;
    }

    await message.reply(`Top memory processes:\n${formatList(topList)}`);
  }
};
