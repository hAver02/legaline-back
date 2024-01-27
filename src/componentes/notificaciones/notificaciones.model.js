
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const notiSchema = new Schema({

    creador : {
        type : Schema.ObjectId,
        ref : 'Users',
        required : true
    },
    tipo : {
        type : String,
        required : true,
        enum : ["solicitud de amistad", 'alarmas']
    },
    vencimiento : {
        type : Date,
    },
    visto : {
        type : Boolean,
        default : false
    },
    mensaje : {
        type : String,
    }
},
{timestamps : true}
)


const notificacionesModel = mongoose.model('Notificaciones', notiSchema)

module.exports = notificacionesModel;