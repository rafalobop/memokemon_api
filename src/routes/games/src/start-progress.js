const express = require('express')
const router = express.Router()

router.post('/', startProgress)

async function startProgress(req,res){
    console.log('ruta iniciar progreso')
}

module.exports = router