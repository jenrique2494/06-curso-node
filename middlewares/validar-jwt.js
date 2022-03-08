const { request } = require("express")
const { response } = require("express");
const Usuario = require('../models/usuario');
const jwt= require('jsonwebtoken');


const validarJWT= async(req=request,res=response,next)=>{

    const token=req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg:'no hay token en la peticion'
        })
    }
    try {
        const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid

        const usuario= await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg:'token no valido - usuario eliminado'
            })
        }

        //verificar si el uid tiene estado en true

        if(!usuario.state){
            return res.status(401).json({
                msg:'token no valido - usuario eliminado'
            })
        }

        req.usuario=usuario;

        req.uid=uid;
        
        next()
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'token no valido'
        })
    }

}
module.exports={
    validarJWT
}