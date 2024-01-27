

const userModel = require('./user.model')

async function getUsers(){
    try {
        const users = await userModel.find({}).populate('casos')
        return users  
    } catch (error) {
        return [false, error]
    }
}
async function getById(id){
    try {
        const user = await userModel.findById(id).populate('casos').populate('amigos')
        return user
    } catch (error) {
        throw Error('Error al obtener el user!')
    }
}
async function getByEmail(email) {
    try {
        const user = await userModel.findOne({email : email})
        return user
    } catch (error) {
        throw Error('Error al obtener el user!')
    }
}
async function createUser(user){
    try {
        const usuario = await userModel.create(user);
        return usuario
    } catch (error) {
        throw Error('Error al crear el user!')
    }
}
async function deleteUser(id){
    try {
        const deleted = await userModel.findByIdAndDelete(id)
        return deleted
    } catch (error) {
        throw Error('Error al eliminar user!')
    }
}
async function updateUser(id, body){
    try {
        const update = await userModel.findOneAndUpdate({ _id : id }, body)
        return update
    } catch (error) { 
        // console.log(error.message);
        throw Error('Error al actualizar')
    }
}
async function addCase(idCase, idUser){
    try {
        const updated = userModel.findByIdAndUpdate(idUser, {
            $push : {
                casos : idCase
            }
        })
        return updated
    } catch (error) {
        throw Error('Error al agregar user ')

    }
}
async function deleteCase(idCase, idUser){
    try {
        const updated = userModel.findByIdAndUpdate(idUser, {
            $pull : {
                casos : idCase
            }
        })

        return updated
        // console.log(userCasos, newUser);
        return 'holis'
    } catch (error) {
        throw Error('Error al eliminar user ')

    }
}
async function addAmigo(email, idUser){
    try {
        const userFriend = await userModel.findOne({email : email})
        if (userFriend){
            const { _id } = userFriend
            const user = await userModel.findById(idUser)
            if(user.amigos.some(us => JSON.stringify(us) == JSON.stringify(_id))) return false
            const idAmigo = _id.toString();
            const updated = await userModel.findByIdAndUpdate(idUser, {
                    $push : {
                        amigos : idAmigo
                    }
                })
            const updated2 = await userModel.findByIdAndUpdate(idAmigo, {
                    $push : {
                        amigos : idUser
                    }
                })
            return updated
        }
        return false
    } catch (error) {
        throw Error('Error al agregar amigo')
    }
}
async function deleteAmigo(idAmigo, idUser){
try {
        const updated = userModel.findByIdAndUpdate(idUser, {
            $pull : {
                amigos : idAmigo
            }
        })
        const updated2 = userModel.findByIdAndUpdate(idAmigo, {
            $pull : {
                amigos : idUser
            }
        })
        return updated
} catch (error) {
    throw Error('error al eliminar amigo')
}
}
async function findByToken(token) {
    try {
        const user = await userModel.findOne({recoveryToken : token})
        return user
    } catch (error) {
        throw Error(error.message)
    }
}




module.exports = {
    findByToken,
    getByEmail,
    getUsers,
    createUser,
    addCase,
    getById,
    deleteUser,
    updateUser,
    deleteCase,
    addAmigo,
    deleteAmigo
}