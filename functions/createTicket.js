const ticketModel = require('../models/ticket');

module.exports = async (guild, user, guildDoc, ticketModel) => {
    guildDoc.ticketCount += 1

    await guildDoc.save()

    const ticketChannel = await guild.channels.create(`ticket-${guildDoc.ticketCount}`, {
        type: 'text',
        permissionOverwrites: [
            {
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                id: user.id
            },
            {
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                id: guild.id
            }
        ]
    })

    const msg = await ticketChannel.send('React with the ❌ to close this ticket\nReact with 📰 to get a ticket transcript');

    msg.react('❌')
    await msg.react('📰')

    const tickDoc = new ticketModel({
        guildID: guild.id,
        userID: user.id,
        channelID: ticketChannel.id,
        msgID: msg.id
    })
    
    await tickDoc.save()
}