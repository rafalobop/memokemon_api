const express = require('express')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const joivalidate = require('../../../libs/joi-validate')
const mongo = require('../../../config/database')
const router = express.Router()

router.post('/', restorePass)

async function restorePass(req,res){
    joivalidate(
        Joi.object({
            newPass: Joi.string().min(1).max(50).required(),
        }),
        req.body,
        res,
        async () => {
            try {
                const db = await mongo()
                const verify = await jwt.verify(req.body.token, process.env.KEY_PRELOGIN)
                console.log('verify', verify)
                
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