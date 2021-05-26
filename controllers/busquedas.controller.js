const { response } = require('express');
const Usuario = require('../models/usuario.models');
const Medico = require('../models/medicos.models');
const Hospital = require('../models/hospital.models');

const getTodo = async (req , res = response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i');
    const [ listaUsuarios, listaMedicos, listaHospitales ] = Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
    ])
    try {
        res.status(200).json({
            ok:true,
            listaUsuarios,
            listaMedicos,
            listaHospitales,
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}

const getDocumentosCollection = async(req, res = response ) => {

    const tabla    = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex    = new RegExp( busqueda, 'i' );

    let data = [];

    switch ( tabla ) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
        break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');
        break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }
    
    res.json({
        ok: true,
        resultados: data
    })

}

module.exports = {
    getTodo,
    getDocumentosCollection,
}