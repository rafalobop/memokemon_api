
const jwt = require('jsonwebtoken')

const validaToken = async (req,res,next)=>{
    
    const token = req.header('auth-token')

    if(!token){
        return res.status(401).json({
            msg:'Debe loguearse para acceder a los datos de su cuenta.',
            code: 1
        })
    }
    try {
        const verify = jwt.verify(token, process.env.KEY_PRELOGIN )
        req.jwt = verify
        next()
    } catch (error) {
        console.log('err', error)
        return res.status(500).json({
            msg:'Hubo un error al validar su usuario, intente nuevamente.',
            code: -1
        })    
    }
}

module.exports = {
    validaToken
}