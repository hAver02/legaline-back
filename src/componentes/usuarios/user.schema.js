const Joi = require('joi')


const id = Joi.string().alphanum()
const nombre = Joi.string().max(50)
const email = Joi.string().max(50).email()
const password = Joi.string().alphanum()
const casos = Joi.array().items(Joi.number())
const amigos = Joi.array().items(Joi.number())



const idCase = Joi.string().alphanum()
const idUser = Joi.string().alphanum()

const createUserSchema = Joi.object({
    nombre : nombre.required(),
    email : email.required(),
    password : password.required()
});
const loginSchema = Joi.object({
    email : email.required(),
    password : password.required()
})
const idSchema = Joi.object({
    id : id.required()
})

const updateUserSchema = Joi.object({
    nombre : nombre,
    email : email,
    password : password
})

const caseToUserSchema = Joi.object({
    idCase : idCase.required(),
    idUser : idUser.required()
})

const addAmigoSchema = Joi.object({
    email : email.required()
})

module.exports = { addAmigoSchema ,createUserSchema, idSchema, updateUserSchema, caseToUserSchema, loginSchema}