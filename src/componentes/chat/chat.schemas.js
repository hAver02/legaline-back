

const Joi = require('joi')

const id = Joi.string().alphanum()
const nombreChat = Joi.string()
const users = Joi.array().items(Joi.string().alphanum())

idUser = Joi.string().alphanum()

const idSchema = Joi.object({
    id : id.required()
})

const createChatSchema = Joi.object({
    nombreChat : nombreChat.required(),
    users : users.required()
})

const add_deleteUserSchema = Joi.object({
    idChat : id,
    idUser : idUser
})


module.exports = {
    idSchema,
    createChatSchema,
    add_deleteUserSchema
}