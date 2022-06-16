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
            token:Joi.string().min(1).max(180).required()
        }),
        req.body,
        res,
        async () => {
            try {
                const db = await mongo()
                const verify = await jwt.verify(req.body.token, process.env.KEY_PRELOGIN)
                if(verify){
                    const {email} = verify
                    const user = await db.collection('users').findOne({email})
                    if(!user){
                        return res.status(401).json({
                            msg: 'No tiene permisos para realizar esta acción, contacte al administrador.',
                            code: 1
                        })
                    }else{
                        const hashedPass = await bcrypt.hash(req.body.newPass, 10)
                        await db.collection('users').updateOne({email}, {$set:{ password: hashedPass}})
                        return res.status(200).json({
                            message: "Contraseña actualizada exitosamente.",
                            code: 2,
                        });
                    }
                }else{
                    return res.status(400).json({
                        msg:'Usted no posee token de usuario, contacte al administrador.',
                        code: 1
                    })
                }
            } catch (error) {
                console.log('ress', error)
                return res.status(500).json({
                    msg: 'Hubo un error en el servidor, intente nuevamente.',
                    code: -1
                })
            }
        }
    )
}

module.exports = router