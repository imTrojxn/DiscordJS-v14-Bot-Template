const { Events, Collection } = require('discord.js');
const { keyv } = require('../index');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        //define variables
        const { client, content, author } = message;
        const clientmention = `<@${client.user.id}>`;
        const prefix = client.config.prefix;

        const args = content.slice(prefix.length).trim().split(/ +/);
        const commandName = args[0].toLowerCase();
        let command = client.chats.get(commandName);
        
        //if bot mentioned reply with either user prefix or default prefix
        if (content === clientmention) return message.reply({ content: `Prefix: \`${prefix}\``, ephemeral: true });
        //if wrong prefix or is bot do nothing
        if (!content.startsWith(prefix) || author.bot) return;
        //check for command aliases
        if (!command) {
            for (const cmd of client.chats.values()) {
                if (cmd.data.aliases) {
                    for (const alias of cmd.data.aliases) {
                        if (alias.includes(commandName)) {
                            command = client.chats.get(cmd.data.name);
                        }
                        break;
                    }
                    break;
                }
            }
        }
        //let user know if command exists
        if (!command) {
            let msg = await message.reply({ content: `The command \`${commandName}\` does not exist, please try again.`, ephemeral: true });
            message.delete();
            setTimeout(() => {
                msg.delete().catch(console.error);
            }, 5000);
            return;
        }
        //check if command is bot owner command
        if (command.data.developer && message.author.id !== client.config.owner) return message.reply({ content: 'This command is an owner only command!', ephemeral: true });
        //check if user isn't a bot owner to deceive cooldowns
        if (message.author.id !== client.config.owner) {
            const { cooldowns } = client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 1;
            const cooldownAmount = (command.data.cooldown ?? defaultCooldownDuration) * 1000;

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1000);
                    return message.reply({ content: `Please wait <t:${expiredTimestamp}:R> more second(s) before reusing the \`${command.data.name}\` command.`, ephemeral: true });
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            await message.reply({
                content: `Something went wrong while executing this command...`,
                ephemeral: true,
            });
        }
    },
};