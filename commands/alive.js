const settings = require("../settings");
const fs = require("fs");
const path = require("path");

async function aliveCommand(sock, chatId, message) {
    try {
        // STEP 1: Original simple text
        const simpleText = ` .   active hai`;
        await sock.sendMessage(chatId, {
            text: simpleText
        }, { quoted: message });

        // STEP 2: Image with hacker-style box as caption
        const boxCaption = `  VIRGIN STATUS MOD  

   BOT : MR MUNEEB ALI
   STATUS : ONLINE 
   MODE : PUBLIC

   FEATURES LOADED :
   GROUP CONTROL
   ANTILINK ACTIVE
   FUN MODULES

   COMMAND : .menu
`;

        await sock.sendMessage(chatId, {
            image: fs.readFileSync(path.join(__dirname, "../assets/bot_image.jpg")),
            caption: boxCaption
        }, { quoted: message });

    } catch (error) {
        console.error("Error in alive command:", error);
        await sock.sendMessage(chatId, { text: "Bot is alive and running!" }, { quoted: message });
    }
}

module.exports = aliveCommand;