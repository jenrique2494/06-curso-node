const { response } = require("express");
const res = require("express/lib/response");
const { Usuario, Producto, Categoria } = require("../models");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas=[
    'categoria',
    'producto',
    'role',
    'usuario'
]

const buscarUsuarios=async(termino='',res=response)=>{

    
    const esMongoId= ObjectId.isValid(termino);

    if(esMongoId){
        const usuario=await Usuario.findById(termino);
        return res.json({
            results:(usuario)? [usuario]:[]
        })
    }

    const regex= new RegExp(termino,'i');

    const usuarios=await Usuario.find({
        $or:[
            {nombre:regex},
            {correo:regex}
        ],
        $and:[{state:true}]
    })
    return res.json({
        results:usuarios
    })

}

const buscarCategorias=async(termino='',res=response)=>{

    
    const esMongoId= ObjectId.isValid(termino);

    if(esMongoId){
        const categoria=await Categoria.findById(termino);
        return res.json({
            results:(categoria)? [categoria]:[]
        })
    }

    const regex= new RegExp(termino,'i');

    const categorias=await Categoria.find({
        nombre:regex,
        state:true
    })
    return res.json({
        results:categorias
    })

}

const buscarProductos=async(termino='',res=response)=>{

    
    const esMongoId= ObjectId.isValid(termino);

    if(esMongoId){
        const producto=await Producto.findById(termino).populate('usuario','nombre').populate('categoria','nombre');
        return res.json({
            results:(producto)? [producto]:[]
        })
    }

    const regex= new RegExp(termino,'i');

    const productos=await Producto.find({
        nombre:regex,
        state:true
    })
    .populate('usuario','nombre').populate('categoria','nombre');

    return res.json({
        results:productos
    })

}






const buscar= (req,res=response)=>{

    const {coleccion,termino}=req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'categoria':
            return buscarCategorias(termino,res);
        break;

        case 'producto':
            return buscarProductos(termino,res);
        break;

        case 'usuario':
            return buscarUsuarios(termino,res);
        break;

        default:
            return res.status(500).json({
                msg:'se me olvido hacer esta busqueda'
            })
        break;
    }

}

module.exports={
    buscar
}