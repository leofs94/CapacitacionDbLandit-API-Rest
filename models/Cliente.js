const mongoose = require("mongoose");

const Cliente = new mongoose.Schema({
    nombre:{type:String},
    apellido:{type:String},
    dni:{type:Number},
    direccion:{type:String, trim:true},
    nota:{type:Number, min:0}
});

module.exports = mongoose.model("Cliente",Cliente);