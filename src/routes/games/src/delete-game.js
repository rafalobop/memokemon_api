const express = require('express')
const router = express.Router()

router.delete('/:id', deleteGame)

async function deleteGame(req,res){
    console.log('ruta delete game')
}

module.exports = router