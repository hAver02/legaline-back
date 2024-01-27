const chatModel = require('./chat.model')



async function addChat(chat){
    try {
        if(chat?.users && Array.isArray(chat.users)){
            const chatt = await chatModel.create(chat)
            return chatt
        }
        throw Error('Datos incompletos.')

    } catch (error) {
        throw Error('Error al crear chat.')
    }
}

async function getChats(){
    try {
        const chats = await chatModel.find().populate('users')
        return chats
    } catch (error) {
        throw Error('Error al obtener los chats.')
    }
}

async function getChat(id){
    try {
        const chat = await chatModel.findOne( { _id : id }).populate('users')
        return chat
    } catch (error) {
        throw Error('Error al obtener el chat.')
    }
}

async function addUserToChat(idChat, idUser){
    try {
        const updated = await chatModel.findByIdAndUpdate(idChat, {
            $push : {
                users : idUser
            }
        })
        return updated
    } catch (error) {
        throw Error("Error agregando usuario al chat.")
    }
}

async function deleteUserToChat(idChat, idUser){
    try {
        const updated = await chatModel.findByIdAndUpdate(idChat, {
            $pull : { users : idUser }
        })
        // console.log(updated);
        return updated
    } catch (error) {
        throw Error("Error eliminando usuario al chat.")
    }

}
module.exports = {
    addChat,
    getChat,
    getChats,
    addUserToChat,
    deleteUserToChat
}