const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
    nombre:{
        type:String,
        required:[true,'El nombre es obligatorio']
    },
    state:{
        type:boolean,
        default:true,
        required:[true,'El nombre es obligatorio']
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true
    }
});

module.exports=model('Categoria', CategoriaSchema);