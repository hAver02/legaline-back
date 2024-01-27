const Joi = require('joi')

const id = Joi.string().alphanum()
const creador = Joi.string().alphanum()
const vencimiento = Joi.date()
const mensaje = Joi.string()
const tipo = Joi.string() 
const ids = Joi.array().items(Joi.string().alphanum())


const createNotiSchema = Joi.object({
    creador : creador.required(),
    vencimiento : vencimiento.required(),
    mensaje : mensaje.required(),
    tipo : tipo.required()
})

const getsNotisSchema = Joi.object({
    ids : ids
})



module.exports = {
    createNotiSchema,getsNotisSchema
}