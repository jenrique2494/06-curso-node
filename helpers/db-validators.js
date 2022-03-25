const { Categoria } = require('../models');
const {Producto} = require('../models');
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

const existeCategoria= async(id='')=>{
    const existeCategoriadb= await Categoria.findById(id);

    if(!existeCategoriadb){
        throw new Error(`la categoria no existe`);
    }
}



const existeCategoriaPorNombre= async(categoria)=>{

    if(categoria){
        const existeCategoriadb= await Categoria.findOne({nombre:categoria.toUpperCase()});
    
        if( !existeCategoriadb){
            throw new Error(`la categoria no existe`);
        }
    }

}

const existeProducto= async(id='')=>{
    const existeProductodb= await Producto.findById(id);

    if(!existeProductodb){
        throw new Error(`la producto no existe`);
    }
}
// validar colecciones permitidas

const coleccionesPermitidas=(coleccion='',colecciones=[])=>{

    const incluida= colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, colecciones: ${colecciones}`)
    }

    return true;

}

module.exports={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    existeCategoriaPorNombre,
    coleccionesPermitidas
}