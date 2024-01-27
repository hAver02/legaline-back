

const { connect } = require('mongoose');
const { config } = require('../config/config');
//'mongodb://127.0.0.1:27017/prueba']
// `mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`

const connectUrl = `mongodb+srv://legaline:${config.passwordMongo}@cluster0.r0uayat.mongodb.net/?retryWrites=true&w=majority`


const configConnection = {
    url : connectUrl,
    options : {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    }
}

const mongoDBconnection = async () => {
    try {
        await connect(configConnection.url, configConnection.options);
        console.log('Estamos conectados!!');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    configConnection,
    mongoDBconnection
}