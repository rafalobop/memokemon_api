const express = require('express')
const {validaToken} = require('../../../middlewares/jwt-validate')
const mongo = require('../../../config/database')
const router = express.Router()

router.get('/:id', validaToken, deleteProgress)

async function deleteProgress(req,res){
    try {
        const db = await mongo()
        const user = await db.collection('users').findOne({email: req.jwt.email})
        if(!user){
            return res.status(401).json({
                msg:'Debes loguearte para acceder a tu información.',
                code: 1
            })
        }
        const game = await db.collection('games').findOne({email: req.jwt.email})

        const userResp = {
            id: user._id,
            name: user.name,
            lastName: user.lastName,
            progress: user.gameProgress,
            email: user.email,
            gameId:game._id
        }
        return res.status(200).json({
            msg:'Información del usuario obtenida',
            user: userResp,
            code:2
        })
    } catch (error) {
        return res.status(500).json({
            msg:'Hubo un error en el servidor, intente nuevamente.',
            code: -1
        })
    }
}

module.exports = router