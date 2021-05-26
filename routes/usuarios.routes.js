const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuarios, updateUsuarios, deleteUsuario } = require('../controllers/usuarios.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT,  getUsuarios);

// Como vamos a tener muchos middleware lo definimos entre []
router.post('/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        // Siempre debe ir ultimo
        validarCampos,
    ],
    crearUsuarios
);

router.put('/:id', 
    [
        // Lo mejor es poner validarJWT, porque si no tiene token, no tiene sentido que siga para hacer el update
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('role', 'El role es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    updateUsuarios
);
router.delete('/:id', 
    validarJWT,
    deleteUsuario
);

module.exports = router;