const express = require('express')
const mongo = require('../../../config/database')
const router = express.Router()

router.get('/', usersRanking)

async function usersRanking(req,res){
    try {
        const db = await mongo()
        const users = await db.collection('users').find({active: true}).toArray()
        const usersFinded = users.filter((us)=> us.gameProgress)
        const orderedUsers = usersFinded.sort((user1, user2)=>{ 
            return user2.gameProgress.scoreTotal - user1.gameProgress.scoreTotal
        })
        const ranking = orderedUsers.map((user)=> {
            return {id: user._id, name: user.name, lastName: user.lastName, score: user.gameProgress.scoreTotal, levelActual: user.gameProgress.levelActual}
        })
        return res.status(200).json({
            msg:'Ranking de puntajes',
            ranking,
            code: 2
        })
        
    } catch (error) {
        console.log('er', error)
        return res.status(500).json({
            msg: 'Hubo un error en el servidor, intente nuevamente.',
            code: -1
        })
    }
}

module.exports = router