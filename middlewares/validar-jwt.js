const jwt = require('jsonwebtoken');


const validarJWT = (req, res, next) => {
    // Leer el token
    const token = req.header('x-token');
    if(!token) {
        res.status(401).json({
            ok:false,
            msg: 'No hay token en la peticion'
        });
    }
    try {
        // Verifica si machea en una parte del token con el JWT_SECRET
        const { uid } = jwt.verify( token, process.env.JWT_SECRET);

        req.uid = uid;

        
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        });
    }
    next();
}
module.exports = {
    validarJWT
}