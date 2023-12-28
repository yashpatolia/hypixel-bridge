const { Events } = require('discord.js');
const { bridgeChannel } = require('../config.json');
const { bot } = require('../index.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (message.channel.id === bridgeChannel && message.author.bot === false) {
			console.log(`[D] ${message.author.username}: ${message.content}`);
			bot.chat(`/gc ${message.author.username}: ${message.content}`);
		}
	},
};