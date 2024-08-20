async function loadCommands(client) {
    console.time("Commands Loaded");
    const { loadFiles } = require('../functions/fileLoader');

    await client.commands.clear();

    client.commands = new Map();
    const commands = new Array();

    let commandsArray = [];

    const files = await loadFiles("./commands");

    for (const file of files) {
        try {
            const command = require(file);
            client.commands.set(command.data.name, command);

            commands.push({ Command: command.data.name, Status: "✅" });
            
            commandsArray.push(command.data.toJSON());
        } catch(error) {
            commands.push({ Command: file.split("/").pop().slice(0, -3), Status: "🛑"})
            console.error(error)
        }
    }
    client.application.commands.set(commandsArray);
    console.table(commands, ["Command", "Status"]);
    console.info("\n\x1b[36m%s\x1b[0m", "Loaded Commands");
    console.timeEnd("Commands Loaded");
}

module.exports = { loadCommands };