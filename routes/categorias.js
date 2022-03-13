const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

//publico
router.get('/',(req,res)=>{
    res.json('get')
} );

//categorias por id publico

router.get('/:id',(req,res)=>{
    res.json('get')
} );

//crear categorias - privado cualquier rol

router.post('/',(req,res)=>{
    res.json('post')
} );


//put categorias - privado cualquier rol

router.put('/:id',(req,res)=>{
    res.json('put')
} );

//delete categorias - privado rol admin

router.delete('/:id',(req,res)=>{
    res.json('delete')
} );


module.exports=router;
