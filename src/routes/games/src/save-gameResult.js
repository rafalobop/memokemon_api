const express = require('express')
const Joi = require('joi')
const mongo = require('../../../config/database')
const joivalidate = require('../../../libs/joi-validate')
const { validaToken } = require('../../../middlewares/jwt-validate')
const router = express.Router()

router.post('/', validaToken, saveResult)

async function saveResult(req, res) {
    joivalidate(
        Joi.object({
            level: Joi.number().integer().required(),
            tiempo: Joi.number().integer().required(),
            movimientos: Joi.number().integer().required(),
            completed: Joi.bool().required(),
            score: Joi.number().integer().required()
        }),
        req.body,
        res,
        async () => {
            try {
                const db = await mongo()
                if (req.body.level === 1) {
                    await db.collection('games').insertOne({ email: req.jwt.email, games: [] })
                }
                if (req.body.completed) {
                    const gameObject = await db.collection('games').findOne({ email: req.jwt.email })

                    let exist = gameObject.games.find(game => game.level === req.body.level)
                    if (exist) {
                        return res.status(400).json({
                            msg: 'El level fue completado con anterioridad.',
                            code: 1
                        })
                    } else {
                        gameObject.games.push(req.body)
                        await db.collection('games').updateOne({ email: req.jwt.email }, { $set: { games: gameObject.games } })
                        res.status(200).json({
                            msg: 'Has completado exitosamente el nivel',
                            code: 2
                        })
                    }
                } else {
                    return res.status(400).json({
                        msg: 'Debes completar el nivel para avanzar al siguiente.',
                        code: 1
                    })
                }

            } catch (error) {
                console.log('err', error)
                return res.status(500).json({
                    msg: 'Hubo un error en el servidor, intente nuevamente.',
                    code: -1
                })
            }
        })

}

module.exports = router