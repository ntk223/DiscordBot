const status = require('./status');
const uptime = require('./uptime');
const load = require('./load');
const disk = require('./disk');
const net = require('./net');
const topcpu = require('./topcpu');
const topmem = require('./topmem');
const report = require('./report');
const help = require('./help');

const commands = [
  status,
  uptime,
  load,
  disk,
  net,
  topcpu,
  topmem,
  report,
  help
];

const commandMap = new Map(commands.map((command) => [command.name, command]));

module.exports = { commands, commandMap };
