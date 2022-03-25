const { Schema, model } = require("mongoose");


const UsuarioSchema= Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    correo:{
        type:String,
        required:[true,'El correo es obligatorio'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'El la clave es obligatoria'],
    },
    img:{
        type:String
    },
    role:{
        type:String,
        required:true,
        enum:['ADMIN_ROLE', 'USER_ROLE']
    },
    state:{
        type:Boolean,
        default:true,
    },
    google:{
        type:Boolean,
        default:false,
    },
});


UsuarioSchema.methods.toJSON= function(){
    const { __v, password,_id:uid, ...user}= this.toObject();
    return {...user,uid};
}
module.exports=model('Usuario',UsuarioSchema);