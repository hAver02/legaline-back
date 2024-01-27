

function validatorError(validacion){
    if(!Array.isArray(validacion)) return false 
    if(validacion[0] === false) return true
    return false
}


function logError (err, req, res, next){
    console.log(err);
    next(err)
}

function handleError(error, req, res, next) {
    const message = error.toString()
    return res.json({
        ok : false,
        message,
    })
}


module.exports = {logError, handleError, validatorError}