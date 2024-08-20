const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        const { client } = interaction
		await interaction.reply(`Client ping is ${await client.ws.ping} ms`);
	},
};
