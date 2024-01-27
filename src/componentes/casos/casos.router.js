
const { Router } = require('express')
const controller = require('./casos.controller')
const userController = require('../usuarios/user.controller')
const route = Router()

const { validatorError } = require('../../middleware/error.handler')
const { validateToken } = require('../../middleware/validatorJWT')
const validatorHandler = require('./../../middleware/validator.handler')
const {idSchema, createCasoSchema, updateCasoSchema, addAlarmaSchema, addPeriodSchema } = require('./casos.schema')


route.get('/', 
    validateToken,
async (req, res, next) => {
    try {
        const casos = await controller.getCasos()
        res.json({
            ok : true,
            casos
        })
    } catch (error) {
        next(error)
    }
})

route.post('/', 
    validateToken,
    validatorHandler(createCasoSchema, 'body'),
async (req, res, next) => {
    try {
        const {caso, userChats} = req.body
        // CREAMOS UN CASO Y UN CHAT
        const addCaso = await controller.addCaso(caso, req.userID, userChats)
        const { _id } = addCaso
        // A CADA UNO DE LOS INTEGRANTES LE AGREGAMOS EL CASO CASO.
        const addCase = await userController.addCase(_id.toString(), req.userID)
        if(userChats.length > 0){
            userChats.map(async (id) => (
                await userController.addCase(_id.toString(), id)
            ))
        }
        return res.json({
            ok : true,
            message : 'caso agregado correctamente'
        })  
        
    } catch (error) {
        next(error)
    }
})

route.get('/:id',
    validateToken,
    validatorHandler(idSchema, 'params'),
async (req, res, next) => {
    try {
        const { id } = req.params
        const caso = await controller.getCasoById(id)
        res.json({ok : true, caso})
    } catch (error) {
        next(error)
    }
})

route.put('/:id',
    validateToken,
    validatorHandler(idSchema, 'params'),
    validatorHandler(updateCasoSchema, 'body'),
async (req, res, next) => {
    try {
        console.log('llega o problemas con el validator?');
        const { id } = req.params
        const body = req.body
        const updated = await controller.updatedCase(id, body)
        res.json({ ok : true, message : 'case updated succesfully'})
    } catch (error) {
        next(error)
    }
})


// Agregar y sacar periodos trabajados

route.put('/addPeriodWorked/:idCase',
    validateToken,
async (req, res, next) => {
    try {
        const body = req.body
        const { idCase } = req.params
        periodWorked = {
            lugar : body.lugar,
            desde : new Date(body.desde),
            hasta : new Date(body.hasta)
        }
        console.log(periodWorked);
        const updated = await controller.addPeriodWorked(idCase, periodWorked)
        // console.log('updated,' , updated);
        if(validatorError(updated)){
            const err = updated[1]
            next(err)
        }
        res.json({ ok : true, message : 'period worked updated sucesfully'})
    } catch (error) {
        next(error)
    }
})

route.put('/deletedPeriodWorked/:idCase/:idPeriod',
    validateToken,
async(req, res, next) => {
    try {
        const { idCase, idPeriod } = req.params 
        const updated = await controller.deletePeriodWorked(idCase, idPeriod)
        res.json({ ok : false, message : 'period worked deleted sucesfully' })
    }catch (error) {
        next(error)
    }
})

route.put('/addAlarma/:idCase/:idNotificacion',
    validateToken,
async (req, res, next) => {
    console.log(req.params);
    try {
        const { idCase, idNotificacion } = req.params
        const addAlarm = await controller.addAlarma(idCase, idNotificacion)
        return res.json({ ok : true, message : 'alarm added succesfully' })
    } catch (error) {
        next(error.message)
    }
})










module.exports = route