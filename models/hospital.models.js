const {Schema, model} = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        // Relacion entre tablas
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
}, { collection: 'hospitales' });

HospitalSchema.method('toJSON', function() {
    const {__v, ...object} = this.toObject();
    return object;
})

module.exports = model('Hospital', HospitalSchema);