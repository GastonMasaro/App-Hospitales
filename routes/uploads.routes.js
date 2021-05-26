const { Router } = require('express');
const { fileUpload, retornaImagen } = require('../controllers/uploads.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');
const expressfileUpload = require('express-fileupload');

router.use(expressfileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);

router.get('/:tipo/:foto', retornaImagen);


module.exports = router;