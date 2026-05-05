const { formatPercent } = require('../utils/format');
const { getResultData } = require('../utils/result');

module.exports = {
  name: 'disk',
  description: 'Show disk usage for a mount point',
  usage: '!disk /',
  async execute({ message, osu, args }) {
    const mountPoint = args[0] || '/';
    const diskResult = await osu.disk.usageByMountPoint(mountPoint);
    const diskInfo = getResultData(diskResult);

    if (!diskInfo) {
      await message.reply(`Disk info not found for ${mountPoint}.`);
      return;
    }

    await message.reply(
      `Disk ${diskInfo.mountpoint}: ${formatPercent(diskInfo.usagePercentage)} used`
    );
  }
};
