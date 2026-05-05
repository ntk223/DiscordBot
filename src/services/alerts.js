const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const osu = require('./os');
const { sendWebhookEmbed } = require('./webhook');
const { formatPercent } = require('../utils/format');
const { getResultData } = require('../utils/result');

const alertState = {
  lastSentAt: 0,
  lastTriggerKey: ''
};

const buildAlertEmbed = (exceeded) => {
  const fields = exceeded.map((item) => ({
    name: item.label,
    value: `${formatPercent(item.value)} (>= ${formatPercent(item.threshold)})`,
    inline: true
  }));

  return new EmbedBuilder()
    .setTitle('VPS Alert')
    .setColor(0xe74c3c)
    .setDescription('Threshold exceeded')
    .addFields(fields)
    .setTimestamp();
};

const getExceededMetrics = async () => {
  const [cpuResult, memResult, diskResult] = await Promise.all([
    osu.cpu.usage(),
    osu.memory.usage(),
    osu.disk.usageByMountPoint(config.alert.diskMount)
  ]);

  const exceeded = [];
  const cpuUsage = getResultData(cpuResult);
  const memUsage = getResultData(memResult);
  const diskUsage = getResultData(diskResult);

  if (Number.isFinite(cpuUsage) && cpuUsage >= config.alert.thresholds.cpu) {
    exceeded.push({
      key: 'cpu',
      label: 'CPU Usage',
      value: cpuUsage,
      threshold: config.alert.thresholds.cpu
    });
  }

  if (Number.isFinite(memUsage) && memUsage >= config.alert.thresholds.memory) {
    exceeded.push({
      key: 'memory',
      label: 'RAM Usage',
      value: memUsage,
      threshold: config.alert.thresholds.memory
    });
  }

  if (
    diskUsage &&
    Number.isFinite(diskUsage.usagePercentage) &&
    diskUsage.usagePercentage >= config.alert.thresholds.disk
  ) {
    exceeded.push({
      key: 'disk',
      label: `Disk Usage (${diskUsage.mountpoint || config.alert.diskMount})`,
      value: diskUsage.usagePercentage,
      threshold: config.alert.thresholds.disk
    });
  }

  return exceeded;
};

const shouldSendAlert = (exceeded) => {
  if (!exceeded.length) {
    return false;
  }

  const now = Date.now();
  const key = exceeded.map((item) => item.key).sort().join('|');

  return !(
    key === alertState.lastTriggerKey &&
    now - alertState.lastSentAt < config.alert.cooldownMs
  );
};

const checkAndSendAlert = async () => {
  if (!config.alert.enabled) {
    return;
  }

  const exceeded = await getExceededMetrics();
  if (!shouldSendAlert(exceeded)) {
    return;
  }

  const embed = buildAlertEmbed(exceeded);
  const result = await sendWebhookEmbed(config.webhookUrl, embed);

  if (!result.ok) {
    console.error(result.error || 'Webhook alert failed.');
    return;
  }

  alertState.lastTriggerKey = exceeded
    .map((item) => item.key)
    .sort()
    .join('|');
  alertState.lastSentAt = Date.now();
};

const startAlerts = () => {
  if (!config.alert.enabled) {
    return;
  }

  const intervalMs = Math.max(config.alert.intervalMs, 10000);
  let running = false;

  const runCheck = async () => {
    if (running) {
      return;
    }

    running = true;
    try {
      await checkAndSendAlert();
    } catch (error) {
      console.error('Alert check failed.', error);
    } finally {
      running = false;
    }
  };

  runCheck();
  setInterval(runCheck, intervalMs);
};

module.exports = { startAlerts };
