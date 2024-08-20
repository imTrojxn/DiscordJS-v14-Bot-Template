module.exports = {
    data: {
        name: 'ping',
        description: 'This is just a ping command',
        developer: false,
        aliases: ['pong'],
        category: 'utility'
    },
    async execute(message, args, client) {
        const command = args[0]
        message.reply(`Client ping is ${await client.ws.ping} ms`);
    },
};