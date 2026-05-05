const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();
  return !['0', 'false', 'no', 'off'].includes(normalized);
};

const config = {
  token: process.env.DISCORD_TOKEN || process.env.TOKEN || '',
  prefix: process.env.COMMAND_PREFIX || '!',
  webhookUrl: process.env.WEBHOOK_URL || '',
  alert: {
    enabled: parseBoolean(process.env.ALERTS_ENABLED, true),
    intervalMs: parseInteger(process.env.ALERT_INTERVAL_MS, 60000),
    cooldownMs: parseInteger(process.env.ALERT_COOLDOWN_MS, 300000),
    diskMount: process.env.ALERT_DISK_MOUNT || '/',
    thresholds: {
      cpu: parseNumber(process.env.ALERT_CPU_PCT, 90),
      memory: parseNumber(process.env.ALERT_MEM_PCT, 90),
      disk: parseNumber(process.env.ALERT_DISK_PCT, 90)
    }
  }
};

module.exports = config;
