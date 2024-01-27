
const jwt = require('jsonwebtoken')
// const { logError } = require('./error.handler')



function validateToken(req, res, next) {
    // console.log(req.cookies);
    const { token } = req.cookies
    // console.log(token);
    // console.log('token', token);
    
    if(!token) return res.status(401).json({ok : false, message : 'Unauthorized'})

    jwt.verify(token, 'SECRET-TOKEN', (error, userID) => {
        if(error) return res.status(403).json({ ok : false, message : "error token"})
        const { id } = userID
        req.userID = id
        next()
    })
}




module.exports = { validateToken }