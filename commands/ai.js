const axios = require('axios');
const fetch = require('node-fetch');

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        
        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: "Please provide a question after .gpt or .gemini\n\nExample: .gpt write a basic html code"
            }, {
                quoted: message
            });
        }

        const parts = text.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: "Please provide a question after .gpt or .gemini"
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(chatId, {
                react: { text: '🤖', key: message.key }
            });

            if (command === '.gpt') {

                // ===== Fallback Free API list for .gpt =====
                const gptAPIs = [
                    `https://api-amine.vercel.app/api/chat?prompt=${encodeURIComponent(query)}`,
                    `https://r-gengpt-api.vercel.app/api/chat?prompt=${encodeURIComponent(query)}`,
                    `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`,
                    `https://vapis.my.id/api/gpt?text=${encodeURIComponent(query)}`,
                    `https://api.siputzx.my.id/api/ai/gpt?text=${encodeURIComponent(query)}`
                ];

                let success = false;
                for (const apiUrl of gptAPIs) {
                    try {
                        const res = await axios.get(apiUrl);
                        const data = res.data;

                        const answer =
                            data.result ||
                            data.answer ||
                            data.data ||
                            data.reply ||
                            data.response;

                        if (answer) {
                            await sock.sendMessage(chatId, {
                                text: answer
                            }, {
                                quoted: message
                            });
                            success = true;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (!success) {
                    throw new Error('All GPT APIs failed');
                }

            } else if (command === '.gemini') {

                // ===== Fallback Free API list for .gemini =====
                const geminiAPIs = [
                    `https://vapis.my.id/api/gemini?q=${encodeURIComponent(query)}`,
                    `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`,
                    `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}`,
                    `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`, 
                    `https://r-gengpt-api.vercel.app/api/chat?prompt=${encodeURIComponent(query)}`, 
                    `https://api-amine.vercel.app/api/chat?prompt=${encodeURIComponent(query)}`
                ];

                let done = false;
                for (const apiUrl of geminiAPIs) {
                    try {
                        const response = await fetch(apiUrl);
                        const json = await response.json();

                        const answer =
                            json.message ||
                            json.data ||
                            json.answer ||
                            json.result ||
                            json.reply;

                        if (answer) {
                            await sock.sendMessage(chatId, {
                                text: answer
                            }, {
                                quoted: message
                            });
                            done = true;
                            break;
                        }
                    } catch (e) {
                        continue;
                    }
                }

                if (!done) {
                    throw new Error('All Gemini APIs failed');
                }

            }

        } catch (error) {
            console.error('API Error:', error);
            await sock.sendMessage(chatId, {
                text: "❌ Failed to get response. Please try again later.",
                contextInfo: {
                    mentionedJid: [message.key.participant || message.key.remoteJid],
                    quotedMessage: message.message
                }
            }, {
                quoted: message
            });
        }

    } catch (error) {
        console.error('AI Command Error:', error);
        await sock.sendMessage(chatId, {
            text: "❌ An error occurred. Please try again later.",
            contextInfo: {
                mentionedJid: [message.key.participant || message.key.remoteJid],
                quotedMessage: message.message
            }
        }, {
            quoted: message
        });
    }
}

module.exports = aiCommand;
