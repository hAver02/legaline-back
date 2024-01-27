const { json } = require('express')
const Joi = require('joi')

const id = Joi.string().alphanum()
const nombre = Joi.string()
const apellido = Joi.string()
const cuil = Joi.number()
const documento = Joi.number()
const idChat = Joi.string().alphanum()
const fechaNac = Joi.date()
const tipoJubilacion = Joi.string()
const recoAnses = Joi.boolean()
const recoIPS = Joi.boolean()
const periodosTrabajados = Joi.array().items(Joi.object({
    lugar : Joi.string(),
    desde : Joi.date(),
    hasta : Joi.any(),
    _id : Joi.string().alphanum()

}))
const claves = Joi.array().items(Joi.object({
    nombre : Joi.string(),
    contraseña : Joi.string(),
    _id : Joi.string().alphanum()
}))

const alarmas = Joi.array().items(
    Joi.string().alphanum()
)


const idSchema = Joi.object({
    id : id
})
const createCasoSchema = Joi.object({
    caso : Joi.object({
        nombre : nombre.required(),
        apellido : apellido.required(),
        cuil : cuil.required(),
        documento : documento.required(),
        fechaNac : fechaNac.required(),
        tipoJubilacion : tipoJubilacion.required(),
        recoAnses : recoAnses.required(),
        recoIPS : recoIPS.required()
    }),
    userChats : Joi.array().items(id)
})


const updateCasoSchema = Joi.object({
    creador : id,
    _id : id,
    nombre : nombre,
    apellido : apellido,
    cuil : cuil,
    documento : documento,
    chat : idChat,
    fechaNac : fechaNac,
    tipoJubilacion : tipoJubilacion,
    recoAnses : recoAnses,
    recoIPS : recoIPS,
    periodosTrabajados : periodosTrabajados,
    claves : claves,
    alarmas : alarmas,
    __v : Joi.any()
})

const addPeriodSchema = Joi.object({
    periodosTrabajados : periodosTrabajados.required()
})

const addAlarmaSchema = Joi.object({
    alarmas : alarmas.required()
})

module.exports = {
    idSchema,
    createCasoSchema,
    updateCasoSchema,
    addPeriodSchema,
    addAlarmaSchema
}