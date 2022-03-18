const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//publico
router.get('/',obtenerCategorias );

//categorias por id publico

router.get('/:id',[
    check('id', 'No es un ID Valido').isMongoId(),
    check("id",'la categoria no existe').custom(existeCategoria),
    validarCampos
],obtenerCategoria);

//crear categorias - privado cualquier rol

router.post('/',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    validarCampos,
],crearCategoria );


//put categorias - privado cualquier rol

router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID Valido').isMongoId(),
    check("id",'la categoria no existe').custom(existeCategoria),
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    validarCampos
],actualizarCategoria);

//delete categorias - privado rol admin

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check("id",'la categoria no existe').custom(existeCategoria),
    validarCampos
],borrarCategoria);


module.exports=router;
