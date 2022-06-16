const express = require('express')
const Joi = require('joi')
const {validaToken} = require('../../../middlewares/jwt-validate')
const mongo = require('../../../config/database')
const router = express.Router()


router.post('/', validaToken, startProgress)

async function startProgress(req,res){
    try {
        const db = await mongo()
        const user = await db.collection('users').findOne({email: req.jwt.email, active:true})
        if(user){
            if(user.gameProgress){
                return res.status(200).json({
                    msg:'Ya iniciaste el progreso en tu partida',
                    code: 1
                })
            }
            const gameProgress = {
                scoreTotal: 0,
                levelActual: 1
            }
            await db.collection('users').updateOne({email: req.jwt.email}, {$set: {gameProgress}})
            return res.status(200).json({
                msg:'Su progreso en el juego ha empezado. Se irá guardando automáticamente al avanzar de nivel.',
                code: 2
            })
        }else{
            return res.status(400).json({
                msg:'Su usuario no existe',
                code: -1
            })
        }
    } catch (error) {
        console.log('err', error)
        return res.status(500).json({
            msg:'Hubo un error en el servidor, intente nuevamente',
            code: -1
        })
    }
}

module.exports = router