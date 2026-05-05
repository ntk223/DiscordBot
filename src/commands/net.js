const { formatBytes } = require('../utils/format');
const { getResultData } = require('../utils/result');

const pickInterface = (interfaces, requested) => {
  if (!Array.isArray(interfaces) || interfaces.length === 0) {
    return null;
  }

  if (requested) {
    return interfaces.find((iface) => iface.name === requested) || null;
  }

  return interfaces.find((iface) => !iface.internal) || interfaces[0];
};

module.exports = {
  name: 'net',
  description: 'Show network stats for an interface',
  usage: '!net eth0',
  async execute({ message, osu, args }) {
    const interfacesResult = await osu.network.interfaces();
    const interfaces = getResultData(interfacesResult);
    const target = pickInterface(interfaces, args[0]);

    if (!target) {
      await message.reply('No network interface data available.');
      return;
    }

    const statsResult = await osu.network.statsByInterface(target.name);
    const stats = getResultData(statsResult);

    if (!stats) {
      await message.reply(
        `Interface ${target.name} is up: ${target.state || 'unknown'} (no stats)`
      );
      return;
    }

    await message.reply(
      `Interface ${target.name}: RX ${formatBytes(stats.rxBytes)}, TX ${formatBytes(
        stats.txBytes
      )}`
    );
  }
};
