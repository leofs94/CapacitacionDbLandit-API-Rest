const mongoose = require("mongoose");
const express = require('express');
var CursosRouter = require('./routes/cursos.js');
 
const app = express();
const port = 3000;

app.use('/api/cursos', CursosRouter);


app.use(express.static('public'));

mongoose.connect('mongodb://localhost/dblandit');
var db = mongoose.connection;

db.on('error',console.error.bind(console, 'connection error:'));

db.once('open',function(){
  app.listen(port,()=> console.log(`Corriendo en ${port}!`))
}); 