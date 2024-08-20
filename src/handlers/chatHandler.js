async function loadChatCommands(client) {
    console.time("Chats Loaded");
    const { loadFiles } = require('../functions/fileLoader');

    await client.chats.clear();

    client.chats = new Map();
    const chats = new Array();

    let chatsArray = [];

    const files = await loadFiles("./chats");

    for (const file of files) {
        try {
            const command = require(file);
            client.chats.set(command.data.name, command);

            chats.push({ Command: command.data.name, Status: "✅" });
            
            chatsArray.push(command.data);
        } catch(error) {
            chats.push({ Command: file.split("/").pop().slice(0, -3), Status: "🛑"})
            console.error(error)
        }
    }
    console.table(chats, ["Command", "Status"]);
    console.info("\n\x1b[36m%s\x1b[0m", "Loaded Chat Commands");
    console.timeEnd("Chats Loaded");
}

module.exports = { loadChatCommands };