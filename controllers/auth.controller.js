const { response } = require('express');
const Usuario = require('../models/usuario.models');
const { generarJWT } = require('../helpers/jwt.js');
const { googleVerify } = require('../helpers/google-verify');
const bcryptjs = require('bcryptjs');

// El token se usa para manejar el estado del usuario en la app.
// Imaginen si tenemos un millon de usuarios en la app, con el token podes saber si expiro la sesion, y cambiar el estado para que se vuelva a logear, y no tener muchas instancias de usuarios a la vez
// El token tiene 3 partes separadas por los puntos
// El header, el payload y la firma.
// en el payload, no poner informacion sensible, contraseñas, etc.
const login = async (req , res = response) => {
    const { email, password } = req.body;
    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if(!usuarioDB) {
            return res.status(404).json({
                ok:false,
                msg: 'Email no encontrado'
            }); 
        }
        // Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, usuarioDB.password );
        if(!validPassword) {
            res.status(400).json({
                ok:false,
                msg: 'Contraseña no valida'
            });
        }
        // Generar el TOKEN.
        const token = await generarJWT(usuarioDB.id);
        res.status(200).json({
            ok:true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const googleSignIn = async (req, res = response) => {
    const googleToken = req.body.token;
    try {
        const {name, email, picture} = await googleVerify(googleToken);
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if(!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password : '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }
        // Guardar en BD
        await usuario.save();
        
        // Generar el TOKEN.
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok:true,
            token
        });
    } catch (error) {
        res.status(401).json({
            ok:true,
            msg: 'Token no es correcto'
        });
    }
}
// Es para actualizar el token de los usuarios, tiene 12 hr de validez
const renewToken = async (req, res = response) => {
    const uid = req.uid;
    const token = await generarJWT( uid );
    const usuario = await Usuario.findById( uid );
    res.json({
        ok: true,
        token,
        usuario
    });
}
module.exports = {
    login,
    googleSignIn,
    renewToken,
}