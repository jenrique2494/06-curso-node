const bcryptjs = require('bcryptjs');
const { response, request } = require('express');
const Usuario = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    const {  page = 1, limit=5, from=0 } = req.query;
    
    
    const [total, usuarios]= await Promise.all([
        Usuario.countDocuments({state:true}),
        Usuario.find({state:true})
        .limit(limit)
        .skip(from)
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    

    const { nombre, correo, password, role } = req.body;

    const usuario= new Usuario({ nombre, correo, password, role });

    //verificar si el usuario existe

    const existeEmail= await Usuario.findOne({correo});

    //encriptar la contrasena

    const salt = bcryptjs.genSaltSync();

    usuario.password=bcryptjs.hashSync(password,salt);

    //guardar

    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, google, password, correo, ...rest } = req.body;

    //Todo validor contra base de datos

    if(password){

        const salt = bcryptjs.genSaltSync();

        rest.password=bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id,rest);

    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    //fisicamente

    //const usuario=await Usuario.findByIdAndDelete(id);

    const usuario= await Usuario.findByIdAndUpdate(id,{state:false})

    res.json({
        usuario
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}