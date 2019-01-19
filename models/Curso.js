const mongoose = require("mongoose");
const Cliente = require("./Cliente.js").schema;


const Curso = new mongoose.Schema({
    anioDictado: {type:Number,min:2000},
    duracion: {type:Number,min:0},
    tema: {type:String,trim:true},
    alumnos: [{type:Cliente,default:[]}],
    nroCurso:{type:Number}
});



Curso.statics.findByNroCurso = function (_id) {
    return this.findOne({_id :_id});
};




module.exports=mongoose.model("Curso",Curso);