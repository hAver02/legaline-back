const { Router } = require('express')
const jwt = require('jsonwebtoken')
const bycrypt = require('bcryptjs')
const {config} = require('./../../config/config')

const { createTokenJWT, createTokenRecoverPassord } = require('../../utils/jwt')
const validatorHandler = require('../../middleware/validator.handler')
const { createUserSchema, loginSchema } = require('../usuarios/user.schema')
const transporter = require('./../../utils/mailer')
const controller = require('../usuarios/user.controller')
const route = Router()

route.post('/register', 
    validatorHandler(createUserSchema, 'body'),
async (req, res, next) => {
    try {
        console.log('aca mo llega');
        const { email, nombre, password } = req.body
        
        const hashPass = await bycrypt.hash(password, 10)
    
        const user = await controller.createUser({ email, nombre, password : hashPass })

        if (Array.isArray(user)) return res.json({ok : false, message : user[1]})
        if(!user) return res.json({ok : false, error : 'error create suser'})
        const token = await createTokenJWT(user.id)
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', 'http://srv471383.hstgr.cloud');
        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true })
        res.json({ ok : true, userID :  user._id })
    } catch (error) {
        // console.log(error);
        next(error)
    }
})

route.post('/login', 
    validatorHandler(loginSchema, 'body'),
async (req, res) => {
    try {
        const { email, password} = req.body

        const user = await controller.getByEmail(email)

        if(!user || (Array.isArray(user) && !user[0])) return res.json({ok : false, message : 'Email not found'})

        const validPass = await bycrypt.compare(password, user.password)

        if(!validPass) return res.json({ok : false, message : 'invalid password'})

        const token = await createTokenJWT(user._id)

        console.log(token);
        // res.header('Access-Control-Allow-Credentials', true);
        // res.header('Access-Control-Allow-Origin', 'http://srv471383.hstgr.cloud');

        // res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: true });
        // res.cookie('token', token, { httpOnly: true, sameSite: 'strict', secure: true });
        // res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: true, domain: '.hstgr.cloud' });
        // res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        const currentDate = new Date()
        const expirationDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

        res.cookie('token', token, { httpOnly: true, sameSite: 'None', secure: true, expires : expirationDate });




        res.json({ ok : true, userID : user._id })


    } catch (error) {
        console.log(error);
        res.json( { ok : false, message : error} )
    }
})

route.post('/logout', async (req, res) => {
    res.cookie('token', '', {expires : new Date(0)})
    return res.json({ok : true,  message : 'logout succesfully'})
})

route.post('/validateToken', async(req, res, next) => {
    const { token } = req.body


    if(!token) return res.json({ok : false})
    try {
        const validate = jwt.verify(token, 'SECRET-TOKEN', async (error, user) => {

            if(error) return res.json({ ok : false, message : error.message })

            const userFound = await controller.getById(user.id)

            if(!userFound) return res.json({ ok : false, message : 'user not found'})

            res.json( {ok : true, id : user.id} )
        })
    } catch (error) {
        next(error.message)
    }
})

route.post('/recovery', async(req, res, next) => {
try {     
        const { email } = req.body

        const user = await controller.getByEmail(email)

        if(!user) return res.json({ok : false, message : 'user not found'})
        const id = JSON.stringify(user._id)
        const token = await createTokenRecoverPassord(id)
        const tokenCodifi = encodeURIComponent(token);

        const link = `http://localhost:5173/new-password?token=${token}`

        const modifyRecoveryToken = await controller.updateUser(user._id, { recoveryToken : token })

        const mail = await transporter.sendMail({
            from : config.email,
            to : email,
            subject : 'RECUPERACION DE CONTRASEÑA',
            text : `Ingrese aqui para ingresar una nueva contraseña. ${link}`

        
        })

        res.json({ok : true})
} catch (error) {
    next(error)
}
})





module.exports = route
