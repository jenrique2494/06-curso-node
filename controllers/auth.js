const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
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

const googleSignIn= async(req,res=response)=>{

    const  {id_token}=req.body;

    try {

        const {nombre,img,correo}=await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        

        if(!usuario){
            //tengo que crearlo
            const data={
                nombre,
                correo,
                password:':p',
                image:img,
                google:true,
                role:'USER_ROLE'
            }
            
            usuario=new Usuario(data);
            console.log(usuario);

            await usuario.save()
        }
        //Si el usuario en db

        if(!usuario.state){
            return res.status(401).json({
                msg:'hable con el administrador usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id)



        res.json({
            msg:'Todo ok',
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'el token no se pudo verificar'
        });
    }

    
}

module.exports={
    login,
    googleSignIn
}