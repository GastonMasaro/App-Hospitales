const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {

    return new Promise ((resolve, reject) => {
        const payload = {
            uid
        }
        // El payload es el cuerpo lo que vos vas a descriptar luego
        // El JWT_SECRET es una palabra al azar, el cual sirve para firmar el token.
        // el tercer argumento es la expiracion
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                // En el payload va a agregar dos campos
                // iat el campo de creacion
                // exp el campo de expiracion
                resolve(token);
            }
            
        });
    })
}

module.exports = {
    generarJWT
}