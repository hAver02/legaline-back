

const notificacionesModel = require('./notificaciones.model')



async function getNotis(){
    try {
        const notis = await notificacionesModel.find({})
        return notis
    } catch (error) {
        throw Error('Error al obtener notificaciones')
    }
}


async function addNoti(notificacion){
    try {
        const newNoti = await notificacionesModel.create(notificacion)
        return newNoti
    } catch (error) {
        throw Error('Error al crear notificacion!')
    }
}


async function getNotiById(ids){
    try {
        const notis = await notificacionesModel.find({_id: { $in: ids }})
        return notis
    } catch (error) {
        throw Error('Error al obtener notificaciones!')
    }
}








module.exports = {
    getNotis,
    addNoti,
    getNotiById
}