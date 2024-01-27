
const { model } = require('mongoose')
const messageModel = require('./messages.model')



async function addMessage(infoMessage){
    try {
        const message = (await messageModel.create(infoMessage)).populate('user')
        return message
    } catch (error) {
        throw Error('Error al crear un mensaje')
    }
}

async function getMessages(){
    try {
        const messages = await messageModel.find().populate('user')
        return messages
    } catch (error) {
        throw Error('Error al obtener los mensajes')
    }
}

async function getIdMessage(id){
    try {
        const message = await messageModel.find({_id  : id}).populate('user')
        // console.log(message); 
        return message
    } catch (error) {
        throw Error('Error al obtener message')
    }
}

async function getMessagesByUser(user){
try {
    const messages = await messageModel.find({user : user}).populate('user')
    return messages
} catch (error) {
    throw Error('Error al obtener los mensajes')
}
}

async function getMessagesByChat(chat){
    try {
        const messages = await messageModel.find({chat : chat}).populate('user')
        return messages
    } catch (error) {
        throw Error('Error al obtener los mensajes')
    }
}

async function getMessagesByChats(chats){
    try {
        const messages = await messageModel.find({chat : { $in : chats }}).populate('user')
        return messages
    } catch (error) {
        throw Error('Error al obtener los mensajes')
    }
}
async function updateMessagesLeidos(ids, idUser){
    // console.log('ids' , ids);
    // console.log(idUser);
    try {
        const updated = await messageModel.updateMany({_id : { $in : ids}}, { $addToSet : { leido : idUser }})
        return updated
    } catch (error) {
        throw Error('Error al leer mensaje')
    }
}
module.exports = {
    getMessagesByChat,
    addMessage,
    getMessages,
    getIdMessage,
    getMessagesByUser,
    getMessagesByChats,
    updateMessagesLeidos
}