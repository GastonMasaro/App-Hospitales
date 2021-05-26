const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt.js');
const Usuario = require('../models/usuario.models');

const getUsuarios = async (req , res) => {

   const desde = Number(req.query.desde) ||  0;
    
    // const usuarios = await Usuario
    //                         .find({}, 'nombre email role google')
    //                         .skip( desde ) // que se salte los registros a partir de desde
    //                         .limit( 5 ) // cuantos registros quiero desde la posicion "desde"

    // const total = await Usuario.count();    
    
    // Si hacia lo de arriba, tenia que primero esperar la paginacion para luego ejecutar el conteo
    // De esta manera, ahora tiro dos ejecuciones a la ves y es mucho mas optimo
    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 )
        ,
        Usuario.countDocuments()
    ]);                    
    res.json({
        ok:true,
        usuarios,
        total
    })
}



const crearUsuarios = async (req , res = response) => {
    const { email, nombre, password } = req.body;
    
    try {
        const existeEmail = await Usuario.findOne({ email });
        if(existeEmail) {
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya esta registrado'
            }); 
        }
        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync(); 
        usuario.password = bcryptjs.hashSync( password, salt ); // Genera una contraseña encriptada
        
        await usuario.save();

        // Generar el TOKEN.
        const token = await generarJWT(usuario.id);
        
        res.json({
            ok:true,
            usuario,
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

const updateUsuarios = async (req , res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById( uid );
        if(!usuarioDB) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe un usuario por ese id'
            }); 
        }
        const {password, google, email, ...campos} = req.body;
        if(usuarioDB.email != email) {
            const existeEmail = await Usuario.findOne({ email });
            if(existeEmail) {
                return res.status(400).json({
                    ok:false,
                    msg: 'El correo ya esta registrado'
                }); 
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );
        res.status(200).json({
            ok:true,
            usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const deleteUsuario = async (req , res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById( uid );
        if(!usuarioDB) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe un usuario por ese id'
            }); 
        }
        await Usuario.findByIdAndDelete(uid);
        res.status(200).json({
            ok:true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    updateUsuarios,
    deleteUsuario,
}