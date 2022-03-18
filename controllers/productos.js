const { response, request } = require('express');
const {Producto, Categoria} = require('../models');

// obtenerProductos - paginado - total- populate

const obtenerProductos = async(req = request, res = response) => {

    const {  page = 1, limit=5, from=0 } = req.query;
    
    
    const [total, productos]= await Promise.all([
        Producto.countDocuments({state:true}),
        Producto.find({state:true})
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .limit(limit)
        .skip(from)
    ])

    res.json({
        total,
        productos
    });
}

// obtenerProducto -  populate

const obtenerProducto = async(req = request, res = response) => {

    const { id } = req.params;
    
    
    const producto = await Producto.findById(id)
                                    .populate('usuario')
                                    .populate('categoria');


    res.json({
        producto
    });
}


const crearProducto=async(req,res=response)=>{

    const {state,usuario,...body}=req.body;

    const nombre=req.body.nombre.toUpperCase();
    const categoria=req.body.categoria.toUpperCase();

    const categoriadb= await Categoria.findOne({nombre:categoria})

    const productoDB=await Producto.findOne({nombre});

    if(productoDB){
        return res.status(400).json({
            msg:`la producto ${productoDB.nombre} ya existe`
        })
    }
    
    //generar data a guardar

    const data={
        ...body,
        nombre,
        usuario:req.usuario._id,
        categoria:categoriadb._id
    }

    const producto= await new Producto(data);
    //guardar db
    await producto.save()

    res.status(201).json({
        msg:'producto creado',
        producto
    })
}

// actualizarProducto
const actualizarProducto=async(req,res=response)=>{

    const { id } = req.params;
    const { _id, state,usuario, ...rest } = req.body;

    if(rest.nombre){
        rest.nombre=rest.nombre.toUpperCase();
    }

    rest.usuario=req.usuario._id;
    
    if(rest.categoria ){
        const categoriadb= await Categoria.findOne({nombre:req.body.categoria.toUpperCase()});
        rest.categoria=categoriadb._id;
    }

    const producto=await Producto.findByIdAndUpdate(id,rest,{new:true}).populate('usuario').populate('categoria');

    await producto.save()

    res.json({
        producto
    });
}

// borrarProducto
const borrarProducto = async(req, res = response) => {

    const { id } = req.params;

    //fisicamente

    //const usuario=await Usuario.findByIdAndDelete(id);

    const producto= await Producto.findByIdAndUpdate(id,{state:false},{new:true}).populate('usuario').populate('categoria');

    const usuarioAutenticado=req.usuario;

    res.json({
        producto,
        usuarioAutenticado
    });
}


module.exports={
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}