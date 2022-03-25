const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarArchivo, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.post('/',[
    validarArchivoSubir,
    validarCampos,
],cargarArchivo );

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos,
],actualizarArchivo );

router.get('/:coleccion/:id',[
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos,
],mostrarImagen );


module.exports=router;
