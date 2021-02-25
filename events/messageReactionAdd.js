const guildModel = require('../models/guild');
const createTicket = require('../functions/createTicket');
const ticketModel = require('../models/ticket');
const fetchALl = require('discord-fetch-all');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');

module.exports = async (client, reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch()
    if (reaction.partial) await reaction.fetch()
    if (user.bot) return
    
    const guild = reaction.message.guild

    var guildDoc = await guildModel.findOne({ guildID: guild.id })

    if (!guildDoc) {
        guildDoc = new guildModel({
            guildID: guild.id,
            ticketCount: 0
        })

        await guildDoc.save()
    }

    if (reaction.message.channel.id === '813276325716557837') { //! your channel id of the ticket reaction message
        if (reaction.emoji.name === '🎫') {
            const ticketDoc = await ticketModel.findOne({ guildID: guild.id, userID: user.id })

            if (ticketDoc) {
                const channel = guild.channels.cache.get(ticketDoc.channelID)

                if (channel) {
                    user.send('You already have a open ticket');
                } else {
                    await ticketDoc.deleteOne()

                    createTicket(guild, user, guildDoc, ticketDoc, ticketModel)
                }
            } else {
                createTicket(guild, user, guildDoc, ticketModel)
            }
        }
    } else {
        const ticketDoc = await ticketModel.findOne({ guildID: guild.id, userID: user.id })

        if (ticketDoc.msgID === reaction.message.id) {
            if (reaction.emoji.name ==='❌') {
                reaction.message.channel.delete()

                await ticketDoc.deleteOne()
                user.send('Your ticket has now been closed').catch(err => console.log(err))
            } else if (reaction.emoji.name === '📰') {
                const msgs = await fetchALl.messages(reaction.message.channel, {
                    reverseArray: true
                })

                const content = msgs.map(m => `${m.author.tag} - ${m.content}`)

                fs.writeFileSync('transcript.txt', content.join('\n'), error => {
                    if (error) throw error
                })

                reaction.message.channel.send(new MessageAttachment('transcript.txt', 'transcript.txt'))
            }
        }
    }
}