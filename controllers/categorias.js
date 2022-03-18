const { response, request } = require('express');
const {Categoria} = require('../models');

// obtenerCategorias - paginado - total- populate

const obtenerCategorias = async(req = request, res = response) => {

    const {  page = 1, limit=5, from=0 } = req.query;
    
    
    const [total, categorias]= await Promise.all([
        Categoria.countDocuments({state:true}),
        Categoria.find({state:true})
        .populate('usuario','nombre')
        .limit(limit)
        .skip(from)
    ])

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria -  populate

const obtenerCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    
    
    const categoria = await Categoria.findById(id).populate('usuario');


    res.json({
        categoria
    });
}


const crearCategoria=async(req,res=response)=>{

    const nombre=req.body.nombre.toUpperCase();

    const categoriaDB=await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg:`la categoria ${categoriaDB.nombre} ya existe`
        })
    }
    //generar data a guardar

    const data={
        nombre,
        usuario:req.usuario._id
    }

    const categoria= await new Categoria(data);
    //guardar db
    await categoria.save()

    res.status(201).json({
        msg:'categoria creada',
        categoria
    })
}

// actualizarCategoria
const actualizarCategoria=async(req,res=response)=>{

    const { id } = req.params;
    const { _id, state,usuario, ...rest } = req.body;

    rest.nombre=req.body.nombre.toUpperCase();

    rest.usuario=req.usuario._id;

    const categoria=await Categoria.findByIdAndUpdate(id,rest,{new:true}).populate('usuario');

    await categoria.save()

    res.json({
        categoria
    });
}

// borrarCategoria
const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;

    //fisicamente

    //const usuario=await Usuario.findByIdAndDelete(id);

    const categoria= await Categoria.findByIdAndUpdate(id,{state:false},{new:true}).populate('usuario');

    const usuarioAutenticado=req.usuario;

    res.json({
        categoria,
        usuarioAutenticado
    });
}


module.exports={
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}