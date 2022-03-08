const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const Usuario = require('../models/usuario');


const login=async(req,res=response)=>{

    const {correo,password}=req.body;

    try {
        //verificar si el email existe

        const usuario= await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario/password no son correctos - correo'
            })
        }

        //si el usuario esta activo

        if(!usuario.state){
            return res.status(400).json({
                msg:'Usuario/password no son correctos - estado:false'
            })
        }

        //verificar la contrasena

        const validPassword = bcryptjs.compareSync(password,usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg:'Usuario/password no son correctos - password'
            })
        }

        //generar jwt

        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'algo salio mal'
        })
    }

    

}

module.exports={
    login
}