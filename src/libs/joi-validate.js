const Joi           = require('joi');

//expected: objeto joi
//reality: body a validar

module.exports = (expected, reality, response, funNext) => {
    try{
        var res = expected.validate(reality);
        if(res.error){
            return response.status(500).json({
                message: 'Ocurrio un inconveniente al evaluar la estructura, intente nuevamente más tarde por favor',
                detail: res.error.message,
                code: -1
            });
        }else{
            funNext();
        }
    }catch(err){
        return response.status(500).json({
            message: 'Ocurrio un inconveniente al evaluar la estructura, intente nuevamente más tarde por favor',
            detail: err.toString(),
            code: -1
        });
    }
}