

const { addChat } = require('../chat/chat.controller');
const casosModel = require('./caso.model')


const addCaso = async (newCaso, userID, userChats) => {
    try {
        const { apellido } = newCaso;
        const chatcase = await addChat({nombreChat : apellido , users : [...userChats, userID]})
        const { _id } = chatcase
        const id = _id.toString()
        const createCaso = {... newCaso, chat : id, creador : userID}
        const caso = await casosModel.create(createCaso)
        return caso
    } catch (error) {
        throw Error(error.message)
    }
}

const getCasos = async () => {
    try {
        const casos = await casosModel.find({}).populate('chat')
        return casos
    } catch (error) {
        throw Error(error.message)
    }
}

const getCasoById = async (id) => {
    try {
        const caso = await casosModel.findById(id)
        if(!caso) throw Error('couldnt find case with this id')
        return caso
    } catch (error) {
        throw Error(error.message)

    }
}

const updatedCase = async (id, newCase)=> {

    try {
        const updated = await casosModel.findByIdAndUpdate(id, newCase)
        return updated
    } catch (error) {
        throw Error(error.message)

    }
}



const addPeriodWorked = async (idCase, period) => {
    console.log(period);
    try {
        const updated = await casosModel.findByIdAndUpdate(idCase , {
            $push : { periodosTrabajados : period}
        })
        // console.log(updated);
        return updated
    } catch (error) {
        throw Error(error.message)
    }
}

const deletePeriodWorked = async (idCase, idPeriod) => {
    try {
        const updated = await casosModel.findByIdAndUpdate(idCase, {
            $pull : {
                periodosTrabajados : {
                    _id : idPeriod
                }
            }
        })
        return updated
    } catch (error) {
        throw Error(error.message)
    }
}

const addAlarma = async( idCase, idNotificacion ) => {   
    try {
        const alarma = await casosModel.findByIdAndUpdate(idCase, {
            $push : {
                alarmas : {
                    _id : idNotificacion
                }
            }
        })
        return alarma
    } catch (error) {
        throw Error(error.message)
    }
}


module.exports = {
    addCaso, 
    getCasos,
    addPeriodWorked,
    deletePeriodWorked,
    getCasoById,
    updatedCase,
    addAlarma
}