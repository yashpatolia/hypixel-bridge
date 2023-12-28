const { Events, EmbedBuilder } = require('discord.js');
const { options } = require('../config.json');
const { webhookClient } = require('../index.js');
const { bot } = require('../index.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Logged in as ${client.user.tag}`);

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

		bot.on('chat', (username, message) => {
			if (username === 'Guild' && message.split(' ')[0] !== options.username) {
				if (!['joined.', 'left.'].includes(message.split(' ').slice(-1)[0])) {
					const regex = /^(?:\[(?<rank>.+?)\])?\s?(?<player>.+?)\s?(?:\[(?<guildRank>.+?)\])?: (?<message>.*)$/;
					const data = message.match(regex);

					webhookClient.send({
						content: data.groups.message,
						username: data.groups.player,
						avatarURL: `https://mc-heads.net/avatar/${data.groups.player}`,
					});
				}
				else {
					const colour = message.split(' ').slice(-1)[0] === 'joined.' ? 0xB2FBA5 : 0xFF6961;
					const embed = new EmbedBuilder()
						.setColor(colour)
						.setDescription(`${message}`);
					username = message.split(' ')[0];

					webhookClient.send({
						username: username,
						embeds: [embed],
						avatarURL: `https://mc-heads.net/avatar/${username}`,
					});
				}
			}
		});

		bot.on('messagestr', (message) => {
			console.log(message);

			if (message.toLowerCase().startsWith('you cannot say the same message twice!')) {
				const embed = new EmbedBuilder()
					.setColor(0xFF6961)
					.setDescription('**You cannot send the same message twice!**');

				webhookClient.send({
					username: 'Bridge',
					embeds: [embed],
				});
			}

			if (message.includes('joined the guild!')) {
				const embed = new EmbedBuilder()
					.setColor(0xB2FBA5)
					.setDescription(`${message}`);

				webhookClient.send({
					username: 'Bridge',
					embeds: [embed],
				});
			}

			if (message.includes('left the guild!')) {
				const embed = new EmbedBuilder()
					.setColor(0xFF6961)
					.setDescription(`${message}`);

				webhookClient.send({
					username: 'Bridge',
					embeds: [embed],
				});
			}
		});
	},
};