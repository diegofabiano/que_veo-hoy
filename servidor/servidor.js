//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('./controladores/controlador.js');
var path = require('path')
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get("/peliculas?", controlador.buscarPeliculas);
app.get("/generos", controlador.buscarGeneros);
app.get("/peliculas/recomendacion", controlador.buscarRecomendaciones);
app.get("/peliculas/:id", controlador.buscarPeliculaPorID);



//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '3000';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

