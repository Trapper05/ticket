const { dbuser, dbpass } = require('../config.json');
const { connect } = require('mongoose');

const url = `mongodb+srv://Trapper05:${dbpass}@cluster0.4zl3y.mongodb.net/test?authSource=admin&replicaSet=atlas-13kys2-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;

module.exports = (client) => {
    console.log('Active');

    connect (url , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    }).then(console.log('MongoDB is connected.'))
}