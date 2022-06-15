const express = require('express')
const bcrypt = require('bcryptjs')
const joivalidate = require('../../../libs/joi-validate')
const Joi = require('joi')
const mongo = require('../../../config/database')
const {validaToken} = require('../../../middlewares/jwt-validate')
const router = express.Router()

router.post('/',validaToken, changePass)

async function changePass(req,res){
    joivalidate(
        Joi.object({
            password: Joi.string().min(1).max(50).required(),
            newPassword: Joi.string().min(1).max(50).required(),
        }),
        req.body,
        res,
        async () => {
            try {
                const db = await mongo()
                const user = await db.collection('users').findOne({ email: req.jwt.email })
                if (user) {
                    const validatePass = await bcrypt.compare(req.body.password, user.password)
                    if(validatePass){
                        const newHashedPass = await bcrypt.hash(req.body.newPassword, 10)
                        await db.collection('users').updateOne({ email: req.jwt.email }, { $set:{ password: newHashedPass }})
                        return res.status(200).json({
                            msg: `Contraseña modificada exitosamente.`,
                            code: 2
                        })
                    }else{
                        return res.status(401).json({
                            msg:'La contraseña ingresada, es incorrecta.',
                            code: 1
                        })
                    }
                } else {
                    return res.status(404).json({
                        msg: 'El usuario al que está intentando acceder, no existe.',
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