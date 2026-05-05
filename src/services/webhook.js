const sendWebhookEmbed = async (webhookUrl, embed) => {
  if (!webhookUrl) {
    return { ok: false, error: 'WEBHOOK_URL is not set.' };
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed.toJSON()] })
  });

  if (!response.ok) {
    return { ok: false, error: `Webhook error: ${response.status}` };
  }

  return { ok: true };
};

module.exports = { sendWebhookEmbed };
