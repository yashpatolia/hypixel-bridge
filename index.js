const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');
const { token, webhookID, webhookToken } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let bot = undefined;
const webhookClient = new WebhookClient({ id: webhookID, token: webhookToken });
module.exports = { bot, webhookClient };

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

// https://discord.com/api/webhooks/1047392420008050720/02w8BwpX6-pgbQ54WaikjMbN_SZfxBzGUzzuhGb8To5kocN3hZNa2MqymGun0oOYW14F