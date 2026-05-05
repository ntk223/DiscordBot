const { buildStatusEmbed } = require('../services/status');
const { sendWebhookEmbed } = require('../services/webhook');

module.exports = {
  name: 'report',
  description: 'Send status report to the configured webhook',
  usage: '!report',
  async execute({ message, config }) {
    const embed = await buildStatusEmbed();
    const result = await sendWebhookEmbed(config.webhookUrl, embed);

    if (!result.ok) {
      await message.reply(result.error || 'Webhook report failed.');
      return;
    }

    await message.reply('Status report sent to webhook.');
  }
};
