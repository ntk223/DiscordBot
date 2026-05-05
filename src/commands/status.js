const { buildStatusEmbed } = require('../services/status');

module.exports = {
  name: 'status',
  description: 'Show CPU, RAM, disk, uptime, and load',
  usage: '!status',
  async execute({ message }) {
    const embed = await buildStatusEmbed();
    await message.reply({ embeds: [embed] });
  }
};
