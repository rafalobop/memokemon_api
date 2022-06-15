const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcryptjs')
const joivalidate = require('../../../libs/joi-validate')
const mongo = require('../../../config/database')
const router = express.Router()

router.post('/', registerNewUser)

async function registerNewUser(req,res){
    joivalidate(
        Joi.object({
            name: Joi.string().min(1).max(50).required(),
            lastName: Joi.string().min(1).max(50).required(),
            email: Joi.string().min(1).max(50).required(),
            password: Joi.string().min(1).max(50).required(),
        }),
        req.body,
        res,
        async()=>{
            try {
                const db = await mongo()
                const user = await db.collection('users').findOne({email: req.body.email})
                if(user){
                    return res.status(409).json({
                        msg: 'El usuario con ese mail ya existe.',
                        code: 1
                    })
                }
                const hashPass = await bcrypt.hash(req.body.password, 10)
                let userRegistered = {
                    name: req.body.name,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hashPass
                }
                await db.collection('users').insertOne(userRegistered)

                return res.status(200).json({
                    msg: 'Usuario creado exitosamente!',
                    code: 2
                })
            } catch (error) {
                return res.status(500).json({
                    msg:'Hubo un error en el servidor, intente nuevamente.',
                    code: -1
                })
            }
        }
    )
}

module.exports = router