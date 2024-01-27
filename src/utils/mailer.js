const nodemailer = require('nodemailer')
const { config } = require('./../config/config')


const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 465,
    secure : true,
    auth : {
        user : config.email,
        pass: config.contraseñaEmail
    }
})


module.exports = transporter