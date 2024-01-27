const { Router } = require('express')

const { validatorError, logError } = require('../../middleware/error.handler')
const { validateToken } = require('../../middleware/validatorJWT')
const validatorHandler = require('../../middleware/validator.handler')
const { addAmigoSchema ,idSchema, updateUserSchema, caseToUserSchema } = require('./user.schema')
const jwt = require('jsonwebtoken')
const controller = require('./user.controller')

const bcrypt = require('bcryptjs')

const route = Router()


route.get('/',
    validateToken,
async (req, res, next) =>{
    try {
        const users = await controller.getUsers()
        if(users){
        return res.json({
            ok : true,
            users
        })}
    } catch (error) {
        next(error)
    }
})
route.get('/:id',
    validatorHandler(idSchema, 'params'),
async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await controller.getById(id)
        if(user){
            return res.json( { ok : true, user : user } )
        }
        res.json({ok : false, message : 'not found user with this id'})
        
    } catch (error) {
        next(error)
    }
})

route.delete('/:id',
    validatorHandler(idSchema, "params"),
async (req, res, next) => {
    try {
        const { id } = req.params
        const deleted = await controller.deleteUser(id)
        res.json( {ok : true, message : "user deleted succesfully"} )
    } catch (error) {
        next(error)
    }
})
route.put('/:id',
    // validateToken(),
    validatorHandler(idSchema,'params'),
    validatorHandler(updateUserSchema, 'body'),
async(req, res, next) => {
    console.log("Ver esto cuando actualizamos");
    const { id } = req.params
    console.log(req.userID, id); 
    const updateUser = req.body;
    try {
        const update = await controller.updateUser(id, updateUser)
        res.json({ok : true, message : 'user updated succesfully'})
    } catch (error) {
        next(error)
    }
})
route.put('/addCase/user', 
    validateToken,
    validatorHandler(caseToUserSchema, 'body'),
async (req, res, next) => {
    // console.log('prueba', req.userID);
    const ids = req.body;
    try {
        const update = await controller.addCase(ids.idCase, ids.idUser)
        if(validatorError(update)){
            const err = update[1]
            next(err)
        }
        res.json({ ok : true, message : 'case added succesfully' })
    } catch (error) {
        next(error)
    }
}
)
route.put('/deleteCasetToUser',
    validateToken,
    validatorHandler(caseToUserSchema, 'body'),
async (req, res, next) => {
    try {
        const { idUser, idCase } = req.body;
        const deleted = await controller.deleteCase(idCase, idUser)
        if(validatorError(deleted)){
            const err = deleted[1]
            next(err)
        }
        res.json( { ok : true, message : 'case deleted succesfully' } )
        
    } catch (error) {
        next(error)
    }
})
route.put('/addFriend/:email', 
    validateToken,
    validatorHandler(addAmigoSchema, "params"),
async (req, res, next) => {
    try {
        const { email } = req.params
        const rta = await controller.addAmigo(email, req.userID)
        if(!rta) return res.json({ok : false, message : 'User not found'})
        res.json({ok : true, rta})
    } catch (error) {
        next(error)
    }
})
route.post('/changePassword', async (req, res, next) => {
    try {
        const {password, password2, token } = req.body
        if(!token) return res.json({ok : false, message : 'doesnt exist token'})
        if(!password === password2) return res.json({ok : false, message : 'The passwords are different'})
        jwt.verify(token, 'SECRET-TOKEN', async (error, user) => {
            if(error) return res.json({ ok : false, message : error.message })
            const { id } = user
            const idS = id.slice(1, -1)
            const usuario = await controller.getById(idS)
            if(!usuario) return res.json({ ok : false, message : 'user not found'})
            if(usuario.recoveryToken =! token ) return res.json({ok : false, message : 'Token no valid'})
            // const usuario = await controller.findByToken(token)


            const hashPass = await bcrypt.hash(password, 10)
            console.log(hashPass);
            const newPass = await controller.updateUser(idS, {password : hashPass})
            if (newPass) await controller.updateUser(idS, {recoveryToken : ''})
            return res.json({
                ok : true, message : 'password changed succesfully'
            })


        })
    } catch (error) {
        console.log(error);
        next(error)
    }
})


module.exports = route 