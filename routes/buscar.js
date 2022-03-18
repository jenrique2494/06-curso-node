const { Router } = require('express');
const { check } = require('express-validator');
const { buscar } = require('../controllers/buscar');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.get('/:coleccion/:termino', [
    check('coleccion','La contrasena es obligatoria').not().isEmpty(),
    check('termino','La contrasena es obligatoria').not().isEmpty(),
    validarCampos
],buscar );


module.exports=router;
