const { Events } = require('discord.js');
const { bridgeChannel } = require('../config.json');
const { bot } = require('../index.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (message.channel.id === bridgeChannel && message.author.bot === false) {
			if (message.content.length > 0) {
				console.log(`[D] ${message.author.username}: ${message.content}`);
				bot.chat(`/gc ${message.author.username}: ${message.content}`);
			}

			for (const attachment of message.attachments.values()) {
				new Promise(resolve => setTimeout(resolve, 500));
				console.log(`[D] ${message.author.username}: ${attachment.url}`);
				bot.chat(`/gc ${message.author.username}: ${attachment.url}`);
			}
		}
	},
};