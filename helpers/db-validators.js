const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido=async(rol='')=>{
    const existeRol= await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no es esta en la base de datos`)
    }
}


const emailExiste= async(correo='')=>{
    const existeEmail= await Usuario.findOne({correo});

    if(correo && existeEmail){
        throw new Error(`el correo ya esta registrado`);
    }
}

const existeUsuarioPorId= async(id='')=>{
    const existeUsuario= await Usuario.findById(id);

    if(id && !existeUsuario){
        throw new Error(`el usuario no existe`);
    }
}

module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}