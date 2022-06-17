const express = require('express')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const joivalidate = require('../../../libs/joi-validate')
const emailManager = require('../../../config/email/managermails')
const mongo = require('../../../config/database')
const router = express.Router()

router.post('/', forgetPass)

async function forgetPass(req,res){
    joivalidate(
        Joi.object({
            email: Joi.string().min(1).max(50).required(),
        }),
        req.body,
        res,
        async () => {
            try {
                const db = await mongo()
                const user = await db.collection('users').findOne({email: req.body.email})
                if(user){
                    const token = jwt.sign({...req.body, password: user.password}, process.env.KEY_PRELOGIN)

                    /*=== AQUI SE MANDA EL MAIL ==='*/

                    let info = {
                        from: `"${process.env.SMTP_NICKNAME}" <${process.env.SMTP_USER}>`,
                        to: req.body.email,
                        subject: "Memokemon - Reestablecer contraseña",
                    };
                    var emailSent = await emailManager.sendEmail(info, {
                        name: 'forgot.html',
                        param: [
                            {key:'href',value:`https://memokemon.herokuapp.com/forgot-pass.html?token=${token}`},
                        ]
                    });
                    if(emailSent){
                        return res.status(200).json({
                            msg: 'Por favor, verifica tu correo para finalizar el reestablecimiento de contraseña',
                            code: 2,
                            token: token
                        });
                    }else{
                        return res.status(500).json({
                            msg: 'Hubo un error al enviar el correo, intente más tarde',
                            code: -1,
                        });
                    }
                }else{
                    return res.status(400).json({
                        msg: 'El usuario con ese email, no existe.',
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
        }
    )
}

module.exports = router