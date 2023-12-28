const fs = require('node:fs');
const path = require('node:path');
const mineflayer = require('mineflayer');
const { Client, GatewayIntentBits, WebhookClient, EmbedBuilder } = require('discord.js');
const { token, options, webhookID, webhookToken } = require('./config.json');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const bot = mineflayer.createBot(options);
const webhookClient = new WebhookClient({ id: webhookID, token: webhookToken });
module.exports = { bot, webhookClient };

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

bot.on('end', () => {
	console.log('[Disconnected] Reconnecting in 5 seconds.');
	const embed = new EmbedBuilder()
		.setColor(0xFF964F)
		.setDescription(`**[Disconnected] Restarting ${options.username}**`);

	webhookClient.send({
		username: 'Bridge',
		embeds: [embed],
	});
	setTimeout(() => bot.connect(options.host), 5000);
});

// https://discord.com/api/webhooks/1047392420008050720/02w8BwpX6-pgbQ54WaikjMbN_SZfxBzGUzzuhGb8To5kocN3hZNa2MqymGun0oOYW14F