const { readdirSync } = require("fs");


async function loadComponents(client) {
    console.time("Components Loaded");

    await client.buttons.clear();
    await client.modals.clear();
    await client.selectMenus.clear();

    const { buttons, selectMenus, modals } = client;
    const components = new Array();

    const componentFolders = readdirSync(`././components`);
    for (const folder of componentFolders) {
        const componentFiles = readdirSync(`./components/${folder}`).filter(
            (file) => file.endsWith(".js")
        );

    switch (folder) {
        case "buttons":
            for (const file of componentFiles) {
                try {
                    const button = require(`../components/${folder}/${file}`);
        
                    buttons.set(button.data.name, button);
        
                    components.push({ Component: button.data.name, Status: "✅" });
                } catch(error) {
                    console.error(error)
                    components.push({ Component: file.split("/").pop().slice(0, -3), Status: "🛑"});
                }
            }
        break;

        case "selectmenus":
        for (const file of componentFiles) {
            try {
                const selectMenu = require(`../components/${folder}/${file}`);
    
                selectMenus.set(selectMenu.data.name, selectMenu);
    
                components.push({ Component: selectMenu.data.name, Status: "✅" });
            } catch(error) {
                components.push({ Component: file.split("/").pop().slice(0, -3), Status: "🛑"});
            }
        }
        break;

        case "modals":
        for (const file of componentFiles) {
            try {
                const modal = require(`../components/${folder}/${file}`);

                modals.set(modal.data.name, modal);

                components.push({ Component: modal.data.name, Status: "✅" });
            } catch(error) {
                components.push({ Component: file.split("/").pop().slice(0, -3), Status: "🛑"});
            }
            break;
        }
        }
    }

    console.table(components, ["Component", "Status"]);
    console.info("\n\x1b[36m%s\x1b[0m", "Loaded Components");
    console.timeEnd("Components Loaded");
}

module.exports = { loadComponents };