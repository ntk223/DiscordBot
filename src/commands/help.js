const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Show available commands',
  usage: '!help',
  async execute({ message, commands, config }) {
    const lines = commands
      .map((command) => `${config.prefix}${command.name} - ${command.description}`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('Commands')
      .setColor(0x5865f2)
      .setDescription(lines);

    await message.reply({ embeds: [embed] });
  }
};
