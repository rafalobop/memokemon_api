const express = require('express')
const router = express.Router()

router.post('/', startNewGame)

async function startNewGame(req,res){
    console.log('ruta iniciar new game')
}

module.exports = router