const { Router } = require('express');
const { getTodo, getDocumentosCollection } = require('../controllers/busquedas.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();
const { validarJWT } = require('../middlewares/validar-jwt');

router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosCollection);


module.exports = router;