const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const joivalidate = require('../../../libs/joi-validate')
const mongo = require('../../../config/database')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/', login)

async function login(req, res) {
    joivalidate(
        Joi.object({
            email: Joi.string().min(1).max(50).required(),
            password: Joi.string().min(1).max(50).required(),
        }),
        req.body,
        res,
        async () => {
            try {
                const db = await mongo()
                const user = await db.collection('users').findOne({ email: req.body.email })
                if (user) {
                    const token = jwt.sign({...req.body}, process.env.KEY_PRELOGIN)
                    const validate = await bcrypt.compare(req.body.password, user.password)
                    if (!validate) {
                        return res.status(401).json({
                            msg: 'La contraseña ingresada es incorrecta',
                            code: 1
                        })
                    }
                    const game = await db.collection('games').findOne({email: req.body.email})
                    console.log('game', game)
                    const userResp = {
                        id: user._id,
                        name: user.name,
                        lastName: user.lastName,
                        progress: user.gameProgress,
                        email: user.email,
                        gamesId: game._id
                    }
                    return res.header('auth-token', token).status(200).json({
                        msg: `Bienvenido ${user.name} ${user.lastName}!`,
                        user:userResp,
                        token,
                        code: 2
                    })
                } else {
                    return res.status(404).json({
                        msg: 'El usuario ingresado no existe.',
                        code: 1
                    })
                }
            } catch (error) {
                return res.status(500).json({
                    msg: 'Hubo un error en el servidor, intente nuevamente.',
                    code: -1
                })
            }
        }
    )
}

module.exports = router