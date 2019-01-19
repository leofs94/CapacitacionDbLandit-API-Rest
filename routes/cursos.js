var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const { checkSchema, validationResult } = require('express-validator/check');
var mongoose = require('mongoose')
const Curso = require("../models/Curso");
const Cliente = require("../models/Cliente");
const NotaAlumno = require("../models/NotaAlumno");

router.use(bodyParser.urlencoded({extended:true}));

router.get('/', function(req,res){
    let busqueda= filtroPorAñoODuracion(req.query)
    console.log(busqueda);
    Curso.find(busqueda).limit(10).then(function(cursos){
        console.log(req.query);
        res.json(cursos);
    }).catch((err)=>{
    console.error(err)
      res.status.send(500);
    res.send();
    });    
});

function findOneCurso(req , res , onSuccess){
    Curso.findByNroCurso(req.params._id).then(function (curso) {

        if(curso == null)
        {
            res.status(404).send();
            return;
        }

        res.json(onSuccess(curso));

    }).catch((err) => {
        console.error(err);
        res.status(500).send();
    });
};


router.get('/:_id', function (req,res) {

    findOneCurso( req , res , (curso) => curso );

});

router.delete('/:_id', function(req,res){
    Curso.findOneAndDelete({_id:req.params._id}).then(function (curso){
        if(curso == null){
            res.status(404).send();
            return;
        }
        res.json(curso);
    }).catch(err=> {
        console.error(err);
        res.status(500).send();
    });
});



filtroPorAñoODuracion = (objeto) =>{
    if(objeto.duracion == undefined && objeto.anioDictado ==undefined ){
        return objeto={};
    }else if(objeto.anioDictado==undefined && objeto.duracion!=undefined){
        return busqueda = {duracion:objeto.duracion};
    }else if(objeto.duracion == undefined && objeto.anioDictado!=undefined){
        return busqueda = {anioDictado:objeto.anioDictado};
    }else if(objeto.duracion!=undefined && objeto.anioDictado!=undefined){
        return busqueda = {anioDictado:objeto.anioDictado,duracion:objeto.duracion}; 
    }else{
        return console.error("Solo puedes buscar por año dictado y duracion");
    }
}


router.post('/',bodyParser.json(), checkSchema(
    {
    anioDictado: {
        in: ['body'],
        errorMessage: 'El campo anioDictado esta mal!',
        isInt: true
    },
    duracion: {
        in: ['body'],
        errorMessage: 'El campo duracion esta mal!',
        isNumeric: true
    },
    tema: {
        in: ['body'],
        errorMessage: 'El campo tema esta mal!',
        isString:true
    },
    alumnos:{
        in:['body'],
        errorMessage:'El campo alumnos es invalido',
        isArray:true
    }
}), function (req, res) {
    let validation = validationResult(req).array();

    if(validation.length > 0)
    {
        res.status(400).json(validation);
        return;
    }

    var curso = new Curso({
        anioDictado:req.body.anioDictado,
        duracion:req.body.duracion,
        tema: req.body.tema,
        alumnos:req.body.alumnos,
        
    });    
    
    
    curso.save().then(doc => {

        res.status(201).json(doc); 

    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });
});

/*
router.patch('/:_id/altaalumno',bodyParser.json(),checkSchema({
    nombre:{
        in:['body'],
        errorMessage:"El Campo nombre es invalido",
        isString:true,
    },
    apellido:{
        in:['body'],
        errorMessage:"El Campo apellido es invalido",
        isString:true
    },
    dni:{
        in:['body'],
        errorMessage:"El Campo dni es invalido",
        isInt:true
    },
    direccion:{
        in:['body'],
        errorMessage:"El Campo direccion es invalido",
        isString:true,
    },
    nota:{
        in:['body'],
        errorMessage:"El Campo nota es invalido",
        isInt:true
    }
}),function(req,res,onSuccess){
    let validation = validationResult(req).array();

    if(validation.length > 0)
    {
        res.status(400).json(validation);
        return;
    }
    var clienteAgregar = new Cliente({
        nombre:req.body.nombre,
        apellido:req.body.apellido,
        dni:req.body.dni,
        direccion:req.body.direccion
    });

    var notaCliente=new NotaAlumno({
        clienteAgregar,
        nota:0
    });

    

    let id=req.params._id;
    Curso.updateOne({_id:id},{alumnos:{$push:notaCliente}}).then(curso => {
        res.status(201).json(curso);
    }).catch((err)=>{
        res.status(500).send();
    });

    

});
*/

router.get('/:_id/mejoralumno',function(req,res,onSuccess){
    let id=req.params._id;
    console.log(id);
    Curso.aggregate([
        {$match:{_id:mongoose.Types.ObjectId(id)}},
        {$unwind:"$alumnos"},
        {$group:{
        _id: {nroCurso:"$nroCurso",dni:"$alumnos.dni",nombre:"$alumnos.nombre",apellido:"$alumnos.apellido"},
        mejorNota: {$max:"$alumnos.nota"}
        }}     
    ]).then(function (curso){

        res.json(curso[0]);
        console.log(curso);
    }).catch((err) =>{
        console.error(err);
        res.status(500).send();
    });
});


router.get('/:_id/alumnos',function(req,res){
    findOneCurso(req,res,(curso=>curso.alumnos));
});

module.exports = router; 