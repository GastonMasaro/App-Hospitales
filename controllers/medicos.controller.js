const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt.js');
const Medico = require('../models/medicos.models');

const getMedicos = async (req , res = response) => {
    const medicos = await Medico.find()
                            .populate('usuario', 'nombre img') // yo en mi modeloSchema define una relacion con otra tabla que moongose guarda, entonces de ese objeto yo le pido traeme la img y el nombre
                            .populate('hospital', 'nombre img')

    res.json({
        ok:true,
        medicos,
    })
}

const crearMedico = async (req , res = response) => {
    const uid = req.uid;
    const medico = new Medico ({ 
        usuario: uid,
        ...req.body 
    });
    try {
        const medicoDB = await medico.save();
        res.json({
            ok:true,
            medico: medicoDB
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarMedico = async (req , res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const medicoDB = await Medico.findById( id );
        if(!medicoDB) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe un medico por ese id'
            }); 
        }
        const cambiosMedico =  {
            ...req.body,
            usuario: uid,    
        }
        // El new = true devuelve el ultimo documento actualizado.
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true});
        res.status(200).json({
            ok:true,
            medico: medicoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const borrarMedico = async (req , res = response) => {
    const id = req.params.id;
    try {
        const medicoDB = await Medico.findById( id );
        if(!medicoDB) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe un medico por ese id'
            }); 
        }
        
        await Medico.findByIdAndDelete(id);
        res.status(200).json({
            ok:true,
            msg: 'Medico eliminado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}