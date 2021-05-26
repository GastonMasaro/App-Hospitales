const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt.js');
const Hospital = require('../models/hospital.models');

const getHospitales = async (req , res = response) => {
    const hospitales = await Hospital.find()
                                    .populate('usuario', 'nombre img') // Te devuelve un json con el id y nombre.

    res.json({
        ok:true,
        hospitales,
    });
}



const crearHospital = async (req , res = response) => {
    const uid = req.uid;
    const hospital = new Hospital ({ 
        usuario: uid,
        ...req.body 
    });
    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok:true,
            hospital: hospitalDB
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }

    res.json({
        ok:true,
    })
}

const actualizarHospital = async (req , res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const hospitalDB = await Hospital.findById( id );
        if(!hospitalDB) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe un usuario por ese id'
            }); 
        }
        const cambiosHospital =  {
            ...req.body,
            usuario: uid,    
        }
        // El new = true devuelve el ultimo documento actualizado.
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true});
        res.status(200).json({
            ok:true,
            hospital: hospitalActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const borrarHospital = async (req , res = response) => {
    const id = req.params.id;
    try {
        const hospitalDB = await Hospital.findById( id );
        if(!hospitalDB) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe un hospital por ese id'
            }); 
        }
        await Hospital.findByIdAndDelete(id);
        res.status(200).json({
            ok:true,
            msg: 'Hospital eliminado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}