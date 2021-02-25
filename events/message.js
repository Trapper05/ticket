const ticketModel = require('../models/ticket');
const guildModel = require('../models/guild');
const createTicket = require('../functions/createTicket')

module.exports = async (client, message) => {
    if (message.content === '?ticketmsg') {
        const msg = await message.channel.send('react to create ticket')

        msg.react('🎫')
    } else if (message.content === '?ticket') {
        const ticketDoc = await ticketModel.findOne({ 
            guildID: message.guild.id,
            userID: message.author.id
        })
        const guildDoc = await guildModel.findOne({ guildID: message.guild.id })

        if (ticketDoc) {
            const channel = message.guild.channels.cache.get(ticketDoc.channelID)

            if (channel) {
                message.reply('you already have a ticket');
            } else {
                createTicket(message.guild, message.author, guildDoc, ticketModel);
            }
        } else {
            createTicket(message.guild, message.author, guildDoc, ticketModel)
        }
    } else if (message.content === '?close') {
        const ticketDoc = await ticketModel.findOne({ channelID: message.channel.id })

        if (!ticketDoc) {
            message.reply('this needs to be done in your ticket or you dont have a open ticket')
        } else {
            message.channel.delete()

            await ticketDoc.deleteOne()
        }
    }
}