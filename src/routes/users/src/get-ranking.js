const express = require('express')
const router = express.Router()

router.get('/', usersRanking)

async function usersRanking(req,res){
    console.log('ruta usersRanking')
}

module.exports = router