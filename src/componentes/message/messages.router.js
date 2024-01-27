
const { Router } = require('express')

const { validateToken } = require("../../middleware/validatorJWT")
const validateHandler = require('./../../middleware/validator.handler')

const { getMessagesSchema, createMessageSchema, getByIdSchema, getMessagesByUser, marcarLeidoSchema } = require('./messages.schema')

const route = Router()
const controller = require('./messages.controller')
const validatorHandler = require('./../../middleware/validator.handler')


route.get('/', 
    validateHandler(getMessagesSchema, 'query'),
async (req, res, next) => {
    try {
        const { chat, user } = req.query
        if(user){
            const messages = await controller.getMessagesByUser(user)
            if(!messages || messages.length == 0){
                return res.json({ ok : false, messages : 'There isnt message with that user'})
            }
            return res.json({ok : true, messages})
        }
        if(chat){
            const messages = await controller.getMessagesByChat(chat)
            if(!messages || messages.length == 0){
                return res.json({ ok : false, messages : 'sin mensajes'})
            }
            return res.json({ok : true, messages})
        }
        const messages = await controller.getMessages()
        res.json({
            ok : true, 
            messages,
        })
    }  catch (error) {
        next(error)
    }

})

route.post('/',
    validateToken,
    validatorHandler(createMessageSchema, 'body'),
async (req, res, next) => {
    try {
        const body = req.body
        const createdMessage = await controller.addMessage(body.user, body.message, body.chat)
        return res.json({
                ok : true, message : 'message added correctly'
        })
    } catch (error) {
        next(error)
    }
    
})

route.get('/:id', 
    validateHandler(getByIdSchema, 'params'),
async (req, res, next) => {
try {
        const { id } = req.params;
        const message = await controller.getIdMessage(id)
    
        if(!message) return res.json({ok : false, message : 'could not find message with that id'})
        res.json({
            ok : true,
            message
        })
} catch (error) {
    next(error)
}
})

route.get('/user/:user', 
    validateToken,
    validateHandler(getMessagesByUser, 'params'),
async (req, res, next) => {
 try {
       const { user } = req.params;
       const messages = await controller.getMessagesByUser(user)
       if(messages.length == 0){
           return res.json({ ok : false, messages : 'There isnt message with that user'})
       }
       res.json({ok : true, messages})
 } catch (error) {
    next(error)
 }
})

route.post('/getByChats', async (req, res, next) =>{
    try {
        const ids = req.body
        const messages = await controller.getMessagesByChats(ids)
        res.json({ ok: true, messages })
    } catch (error) {
        next(error)
    }
})

route.put('/addLeido/', 
    validateToken,
    // validateHandler(marcarLeidoSchema, 'body'), ARREGLAR PARA QUE FUNCIONE.
async (req, res, next) => {
    const idsMessages = req.body
    // console.log(idsMessages);
    try {
        const updated = await controller.updateMessagesLeidos(idsMessages, req.userID)
        res.json({ok : true, message : 'message leido'})
    } catch (error) {
        next(error)
    }
} )




module.exports = route