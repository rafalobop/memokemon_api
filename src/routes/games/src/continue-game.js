const express = require('express')
const mongo = require('../../../config/database')
const {validaToken} = require('../../../middlewares/jwt-validate')
const router = express.Router()

router.get('/', validaToken, continueGame)

async function continueGame(req,res){
    try {
        const db = await mongo()
        const user = await db.collection('users').findOne({email: req.jwt.email})
        if(!user.gameProgress){
            return res.status(400).json({
                msg:'No hay progreso iniciado en el juego. A jugar!',
                code: 1
            })
        }else{
            return res.status(200).json({
                name: user.name,
                lastName: user.lastName,
                email: req.jwt.email,
                progress:{
                    levelActual: user.gameProgress.levelActual,
                    scoreTotal: user.gameProgress.scoreTotal,
                },
                code: 2
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