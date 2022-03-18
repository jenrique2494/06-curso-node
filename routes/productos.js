const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoriaPorNombre } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//publico
router.get('/',obtenerProductos );

//productos por id publico

router.get('/:id',[
    check('id', 'No es un ID Valido').isMongoId(),
    check("id",'la producto no existe').custom(existeProducto),
    validarCampos
],obtenerProducto);

//crear productos - privado cualquier rol

router.post('/',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('categoria','la categoria es obligatoria').not().isEmpty(),
    check("categoria",'la categoria no existe').custom(existeCategoriaPorNombre),
    validarCampos,
],crearProducto );


//put productos - privado cualquier rol

router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID Valido').isMongoId(),
    check("id",'la producto no existe').custom(existeProducto),
    check("categoria",'la categoria no existe').custom(existeCategoriaPorNombre),
    validarCampos
],actualizarProducto);

//delete productos - privado rol admin

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check("id",'la producto no existe').custom(existeProducto),
    validarCampos
],borrarProducto);


module.exports=router;
