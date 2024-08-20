const { Events } = require('discord.js');
const { loadCommands } = require('../handlers/commandHandler');
const { loadChatCommands } = require('../handlers/chatHandler');
const { loadComponents } = require("../handlers/componentHandler");
const { keyv } = require('../index');
module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
        await loadCommands(client);
        await loadChatCommands(client);
        await loadComponents(client);


		await console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
