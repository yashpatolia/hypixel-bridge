const { Events, EmbedBuilder } = require('discord.js');
const mineflayer = require('mineflayer');
const { options } = require('../config.json');
const { webhookClient } = require('../index.js');
var { bot } = require('../index.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        bot = mineflayer.createBot(options);
        console.log(`Logged in as ${client.user.tag}`);
        
        // On Spawn
        bot.once('spawn', () => {
            console.log(`[Online] ${options.host}`);
            
            const embed = new EmbedBuilder()
                .setColor(0xB2FBA5)
                .setDescription(`**${options.username} Online**`);

            webhookClient.send({
                username: 'Bridge',
                embeds: [embed],
            });
        });

        // On Message
        bot.on('chat', (username, message) => {
            if (username === 'Guild') {
                console.log(message);
            }
        });
    }
};