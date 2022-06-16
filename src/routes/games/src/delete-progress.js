const express = require('express')
const {validaToken} = require('../../../middlewares/jwt-validate')
const mongo = require('../../../config/database')
const { ObjectId } = require('mongodb')
const router = express.Router()

router.delete('/:id', validaToken, deleteProgress)

async function deleteProgress(req,res){
    try {
        const db = await mongo()
        const user = await db.collection('games').findOne({_id: ObjectId(req.params.id)})
        if(user.games.length === 0){
            return res.status(400).json({
                msg:'No hay progreso en el juego. Comience a jugar!',
                code: 1
            })
        }
        await db.collection('games').updateOne({_id: ObjectId(req.params.id)}, {$set:{games:[]}})
        return res.status(200).json({
            msg:'Progreso del juego, reestablecido. A Jugar!',
            code: 2
        })
    } catch (error) {
        return res.status(500).json({
            msg:'Hubo un error en el servidor, intente nuevamente.',
            code: -1
        })
    }
}

module.exports = router