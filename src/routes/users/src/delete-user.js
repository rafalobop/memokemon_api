const express = require('express')
const router = express.Router()
const mongo = require('../../../config/database')
const {validaToken} = require('../../../middlewares/jwt-validate')

router.delete('/', validaToken, deleteUser)

async function deleteUser(req,res){
    try {
        const db = await mongo()
        const user = await db.collection('users').findOne({email: req.jwt.email})
        if(!user){
            return res.status(404).json({
                msg:'El usuario que está intentando eliminar, no está disponible.',
                code: 1
            })
        }
        if(user.active){
            await db.collection('users').updateOne({email: req.jwt.email}, {$set:{active: false}})
            return res.status(200).json({
                msg: 'Usuario eliminado correctamente',
                code: 2
            })
        }else{
            return res.status(400).json({
                msg:'El usuario ya fue eliminado previamente',
                code: 1
            })
        }
    } catch (error) {
        return res.status(500).json({
            msg:'Hubo un error en el servidor, intente nuevamente.',
            code: -1
        })
    }
}
module.exports = router