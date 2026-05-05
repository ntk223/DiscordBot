const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');
const osu = require('./services/os');
const { commands, commandMap } = require('./commands');
const { startAlerts } = require('./services/alerts');

const createClient = () =>
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

const parseCommand = (content, prefix) => {
  if (!content || !content.startsWith(prefix)) {
    return null;
  }

  const raw = content.slice(prefix.length).trim();
  if (!raw) {
    return null;
  }

  const [name, ...args] = raw.split(/\s+/);
  return { name: name.toLowerCase(), args };
};

const startBot = () => {
  if (!config.token) {
    console.error('Missing DISCORD_TOKEN or TOKEN environment variable.');
    process.exit(1);
  }

  const client = createClient();

  client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    startAlerts();
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) {
      return;
    }

    const parsed = parseCommand(message.content, config.prefix);
    if (!parsed) {
      return;
    }

    const command = commandMap.get(parsed.name);
    if (!command) {
      return;
    }

    try {
      await command.execute({
        message,
        args: parsed.args,
        osu,
        config,
        commands
      });
    } catch (error) {
      console.error(`Command failed: ${parsed.name}`, error);
      await message.reply('Command failed. Please try again.');
    }
  });

  client.login(config.token);
};

module.exports = { startBot };
