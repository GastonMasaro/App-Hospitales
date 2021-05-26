const fs = require('fs'); // File System para el manejo de carpetas y archivos
const Usuario = require('../models/usuario.models');
const Medico = require('../models/medicos.models');
const Hospital = require('../models/hospital.models');
const borrarImagen = (path) => {
    if(fs.existsSync(path)) {
        // Borra la imagen vieja
        fs.unlinkSync(path);
    }
}
const actualizarImagen = async (tipo, id, nombreArchivo) => {
    let pathViejo = '';
    switch ( tipo ) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if(!medico) {
                return false;
            }
            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);
            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if(!hospital) {
                return false;
            }
            if(hospital.img) {
                pathViejo = `./uploads/hospitales/${hospital.img}`;
                borrarImagen(pathViejo);
                hospital.img = nombreArchivo;
                await hospital.save();
            } else {
                hospital.img = nombreArchivo;
                await hospital.save();
            }
            return true;
        break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario) {
                return false;
            }
            if(usuario.img) {
                pathViejo = `./uploads/usuarios/${usuario.img}`;
                borrarImagen(pathViejo);
                usuario.img = nombreArchivo;
                await usuario.save();
            } else {
                usuario.img = nombreArchivo;
                await usuario.save();
            }
            return true;
            
        break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }
}

module.exports = {
    actualizarImagen
}