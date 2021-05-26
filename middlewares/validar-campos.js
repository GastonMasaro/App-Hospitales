const { response } = require('express');
const { validationResult } = require('express-validator');
// Se opto de llevar esta funcion a un archivo que pueda ser reutilizado por varias rutas.
const validarCampos = (req, res, next) => {
    // Al hacer un validationResult, va agregar al req, los errores que hubo
    const errores = validationResult( req );
    if(!errores.isEmpty()) {
        return res.status(400).json({
            ok:false,
            errores: errores.mapped()
        }); 
    }

    next();
}

module.exports = {
    validarCampos
}