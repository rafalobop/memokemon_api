const express = require('express')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const { validaToken } = require('../../../middlewares/jwt-validate')
const joivalidate = require('../../../libs/joi-validate')
const mongo = require('../../../config/database')
const { ObjectId } = require('mongodb')
const router = express.Router()

router.put('/:id', validaToken, updateUser)

async function updateUser(req, res) {
    joivalidate(
        Joi.object({
            name: Joi.string().min(1).max(50).required(),
            lastName: Joi.string().min(1).max(50).required(),
        }),
        req.body,
        res,
        async () => {
            try {
                const db = await mongo()
                const { id } = req.params
                const user = await db.collection('users').findOne({ _id: ObjectId(id), active:true })
                if (!user) {
                    return res.status(400).json({
                        msg: 'El usuario a modificar, no existe.',
                        code: 1
                    })
                }
                await db.collection('users').updateOne({ _id: ObjectId(id) }, { $set: { name: req.body.name, lastName: req.body.lastName } })
                res.status(200).json({
                    msg: 'Usuario actualizado correctamente',
                    code: 2
                })
            } catch (error) {
                return res.status(500).json({
                    msg: 'Hubo un error en el servidor, intente nuevamente.',
                    code: -1
                })
            }
        })
}

module.exports = router
