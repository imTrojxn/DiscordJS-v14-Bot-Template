const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const { AutoModerationConfiguration, DirectMessageReactions, GuildInvites, GuildMessageReactions, GuildModeration, GuildVoiceStates, MessageContent, AutoModerationExecution, DirectMessageTyping, GuildEmojisAndStickers, GuildMembers, GuildMessageTyping, GuildPresences, GuildWebhooks, DirectMessagePolls, DirectMessages, GuildIntegrations, GuildMessagePolls, GuildMessages, GuildScheduledEvents, Guilds } = GatewayIntentBits;

const client = new Client({ intents: [AutoModerationConfiguration, DirectMessageReactions, GuildInvites, GuildMessageReactions, GuildModeration, GuildVoiceStates, MessageContent, AutoModerationExecution, DirectMessageTyping, GuildEmojisAndStickers, GuildMembers, GuildMessageTyping, GuildPresences, GuildWebhooks, DirectMessagePolls, DirectMessages, GuildIntegrations, GuildMessagePolls, GuildMessages, GuildScheduledEvents, Guilds] });

client.config = require('../config.json');
client.events = new Collection();
client.commands = new Collection();
client.chats = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.cooldowns = new Collection();

//database stuff
const Keyv = require('keyv');
const keyv = new Keyv(client.config.database_url)
const userdb = new Keyv(client.config.database_url, { namespace: 'users' });
const guilddb = new Keyv(client.config.database_url, { namespace: 'guilds' });

//command handler
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//file loader
const { loadEvents } = require('./handlers/eventHandler');
loadEvents(client).catch(console.error);

//client login
client.login(client.config.token).catch(console.error);

//error handling
process.on("uncaughtException", (err) => {
    console.error('Uncaught Exception:', err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("[FATAL] Possibly Unhandled Rejection at: Promise", promise, "\nreason:", reason.message);
});

module.exports = { keyv, userdb, guilddb };