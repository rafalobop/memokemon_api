const express = require('express')
const mongo = require('../../../config/database')
const router = express.Router()

router.get('/', usersRanking)

async function usersRanking(req,res){
    try {
        const db = await mongo()
        const users = await db.collection('users').find().toArray()
        
    } catch (error) {
        return res.status(500).json({
            msg: 'Hubo un error en el servidor, intente nuevamente.',
            code: -1
        })
    }
}

module.exports = router