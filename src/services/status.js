const { EmbedBuilder } = require('discord.js');
const osu = require('./os');
const { formatPercent, formatNumber } = require('../utils/format');
const { getResultData } = require('../utils/result');

const buildStatusEmbed = async () => {
  const [cpuResult, memResult, diskResult, uptimeResult, loadResult] =
    await Promise.all([
      osu.cpu.usage(),
      osu.memory.usage(),
      osu.disk.usageByMountPoint('/'),
      osu.system.uptime(),
      osu.system.load()
    ]);

  const cpuUsage = getResultData(cpuResult);
  const memUsage = getResultData(memResult);
  const diskUsage = getResultData(diskResult);
  const uptimeInfo = getResultData(uptimeResult);
  const loadInfo = getResultData(loadResult);

  const uptimeText = uptimeInfo ? uptimeInfo.uptimeFormatted : 'N/A';
  const loadText = loadInfo
    ? `${formatNumber(loadInfo.load1)} / ${formatNumber(loadInfo.load5)} / ${formatNumber(loadInfo.load15)}`
    : 'N/A';

  const embed = new EmbedBuilder()
    .setTitle('VPS Status')
    .setColor(0x00ae86)
    .addFields(
      { name: 'CPU Usage', value: formatPercent(cpuUsage), inline: true },
      { name: 'RAM Usage', value: formatPercent(memUsage), inline: true },
      {
        name: 'Disk Usage (/)',
        value: formatPercent(diskUsage ? diskUsage.usagePercentage : null),
        inline: true
      },
      { name: 'Uptime', value: uptimeText, inline: true },
      { name: 'Load (1/5/15)', value: loadText, inline: true }
    )
    .setTimestamp();

  return embed;
};

module.exports = { buildStatusEmbed };
