const Joi = require('joi')


const id = Joi.string().alphanum()
const user = Joi.string().alphanum()
const message = Joi.string()
const date = Joi.date()
const chat = Joi.string().alphanum()
const leido = Joi.array().items(Joi.string())



const getMessagesSchema = Joi.object({
    user : user,
    chat : chat
})
const createMessageSchema = Joi.object({
    message : message.required(),
    user : user.required(),
    chat : chat.required()

})
const getByIdSchema = Joi.object({
    id : id.required()
})
getMessagesByUser = Joi.object({
    user : user.required()
})

const marcarLeidoSchema = Joi.isSchema({
    idsMessages : leido.required()
})

module.exports = {
    getMessagesSchema,
    createMessageSchema,
    getByIdSchema,
    getMessagesByUser,
    marcarLeidoSchema
}