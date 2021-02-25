const { token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION', 'CHANNEL'] });
const fs = require('fs');

client.prefix = '?';

fs.readdir('./events', (error, files) => {
    if (error) throw error
    files.forEach(file => {
        const event = require(`./events/${file}`);
        const eventName = file.split('.')[0]
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)]
    })
})

client.login(token)