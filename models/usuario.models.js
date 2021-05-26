const {Schema, model} = require('mongoose');

// Schema es la definición de como va a ser mi entidad en la bd
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        // La propiedad unique es para indicar que va hacer unico
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default:false
    },
});

// Sirve para extraer aquellos campos que no interesan, en este caso "__v", "_id"
UsuarioSchema.method('toJSON', function() {
    const {__v, _id , password, ...object} = this.toObject();
    object.uid = _id;
    return object;
})

// Con el exports expones para afuera el Schema
module.exports = model('Usuario', UsuarioSchema);