const express = require('express')
const router = express.Router()

router.get('/', continueGame)

async function continueGame(req,res){
    console.log('ruta continue game')
}

module.exports = router