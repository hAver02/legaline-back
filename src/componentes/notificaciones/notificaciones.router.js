const { Router } = require('express')

const sendAlarmEmail = require('../../utils/cron')

const { createNotiSchema, getsNotisSchema } = require('./notificaciones.schema')
const validatorHandler = require('./../../middleware/validator.handler')
const { validateToken } = require('../../middleware/validatorJWT')

const controller = require('./notificaciones.controller')
const userController = require('./../usuarios/user.controller')

const route = Router()



route.get('/', async(req, res, next) => {
    try {
        const notificaciones = await controller.getNotis()
        res.json({ ok : true, notificaciones})
    } catch (error) {
        next(error)
    }
})
route.get('/getAlarmas/:arrayIDS',
    validateToken,
    // validatorHandler(getsNotisSchema, 'params'),
async (req, res, next) => {
    try {
        const { arrayIDS } = req.params
        const arrayIDSstr = arrayIDS.split(',')
        const notificaciones = await controller.getNotiById(arrayIDSstr)

        res.json({ok : true, notificaciones})
    } catch (error) {
        next(error)
    }
})
route.post('/', 
    validateToken,
    validatorHandler(createNotiSchema, 'body'),
async (req, res, next) => {
    try {
        const notificacion = req.body
        // console.log(notificacion);
        const {creador} = req.body
        const { email } = await userController.getById(creador)

        const newNoti = await controller.addNoti(notificacion)
        sendAlarmEmail(newNoti, email)

        res.json( { ok : true, notificacion : newNoti } )
    } catch (error) {
        next(error)
    }
})









module.exports = route