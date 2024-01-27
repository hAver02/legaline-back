const { Router } = require('express')
const controller = require('./chat.controller')

const validateHandler = require('./../../middleware/validator.handler')
const  {validateToken} = require('./../../middleware/validatorJWT')
const { idSchema, createChatSchema, add_deleteUserSchema } = require('./chat.schemas')

const route = Router()

route.get('/', async (req, res, next) => {
    try {
        const chats = await controller.getChats()
        res.json({ ok : true, chats })
    } catch (error) {
        next(error)
    }
})

route.get('/:id', 
    // validateToken,
    validateHandler(idSchema, 'params'),
async (req, res, next) => {
    try {
        const { id } = req.params
        const chat = await controller.getChat(id)
        res.json({ ok : true, chat })
    } catch (error) {
        next(error)
    }
})

route.post('/', 
    validateToken,
    validateHandler(createChatSchema, 'body'),
async (req, res, next) => {
    try {
        const users = req.body
        const chat = await controller.addChat(users)
        res.json({ ok : true, chat })
    } catch (error) {
        next(error)
    }
})

route.put('/:idChat/addUser/:idUser', 
    validateToken,
    validateHandler(add_deleteUserSchema, 'params'),
async (req, res, next) => {
    try {
        const { idChat, idUser } = req.params
        const updated = await controller.addUserToChat(idChat, idUser)

        res.json({ ok: true, message : 'user added succesfully' })

    } catch (error) {
        next(error)
    }
})

route.put('/:idChat/deleteUser/:idUser', 
    validateToken,
    validateHandler(add_deleteUserSchema, 'params'),
async (req, res, next) => {
    try {
        const { idChat, idUser } = req.params;
        const updated = await controller.deleteUserToChat(idChat, idUser)

        res.json({ ok : true, message : 'user deleted succesfully from chat'})
    } catch (error) {
        next(error)
    }
})



module.exports = route