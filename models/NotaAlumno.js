const mongoose = require('mongoose');
const Cliente = require("./Cliente.js").schema;


const NotaAlumno = new mongoose.Schema({
    alumno:{type:mongoose.Schema.Types.ObjectId,ref: 'Cliente'},
    nota: {type:Number,min:0,default:0} 
});

module.exports = mongoose.model("NotaAlumno",NotaAlumno)