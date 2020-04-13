var con = require('../lib/conexionbd');


function buscarPeliculas(req, res) {
  var sql = 'SELECT * FROM pelicula WHERE 1+1';
  var titulo = req.query.titulo;
  var anio = req.query.anio;
  var genero = req.query.genero;
  var orden = req.query.columna_orden;
  var pagina = req.query.pagina;
  var cantidad = req.query.cantidad;

      //filtros por titulo, año y genero
    if(titulo) {
        sql += ` AND titulo LIKE "%${titulo}%"`;
    }
    if(anio) {
        sql += ` AND anio = ${anio}`;
    }
    if(genero) {
        sql += ` AND genero_id = ${genero}`;
    }
    //orden de las peliculas
    switch(orden) {
        case 'anio':
            sql += ' ORDER BY anio DESC';
        break;
        case 'puntacion':
            sql += ' ORDER BY puntacion DESC';
        break;
        default:
            sql += ' ORDER BY titulo';
    }

    //var sql = "select * from pelicula"
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            'peliculas': resultado
        };

        res.send(JSON.stringify(response));
    });
}

function buscarGeneros(req, res) {
  var sql = "select * from genero"
  con.query(sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      var response = {
          'generos': resultado
      };

      res.send(JSON.stringify(response));
  });
}

//funcion que obtiene la info de una pelicula segun su id
function buscarPeliculaPorID(req, res) {
    var id = req.params.id;
    var sqlPelicula = 'SELECT * FROM pelicula WHERE id = ' + id;
    var sqlActores = 'SELECT nombre FROM actor JOIN actor_pelicula ON actor.id = actor_pelicula.actor_id JOIN pelicula ON pelicula.id = actor_pelicula.pelicula_id WHERE pelicula.id = ' + id;
    var sqlGenero = 'SELECT nombre FROM genero JOIN pelicula ON genero.id = pelicula.genero_id WHERE pelicula.id = ' + id;
    
    //consulta que obtiene la info de la tabla pelicula
    con.query(sqlPelicula, function(error, result, fields) {
        if (error) {
            console.log('Hubo un error en la consulta1', error.message);
            return res.status(404).send('Hubo un error en la consulta');
        };
        var respuesta = {
            'pelicula': result[0],
            'actores': '',
            'genero': ''
        };

        //consulta que obtiene los nombres de los actores
        con.query(sqlActores, function(errorAct, resultAct, fieldsAct) {
            if (errorAct) {
                console.log('Hubo un error en la consulta2', error.message);
                return res.status(404).send('Hubo un error en la consulta');
            };
            respuesta.actores = resultAct;
        //consulta que obtiene el genero
        con.query(sqlGenero, function(errorGen, resultGen, fieldsGen) {
            if (errorGen) {
                console.log('Hubo un error en la consulta', error.message);
                return res.status(404).send('Hubo un error en la consulta');
            };
            respuesta.genero = resultGen[0].nombre;                
            res.send(JSON.stringify(respuesta));
        });
    });
});
}



// funcion para recomendar peliculas
function buscarRecomendaciones(req, res) {
  var filtro = 
  sql = 'SELECT * FROM pelicula ' + filtro;
  var genero = req.query.genero;
  var anio_inicio = req.query.anio_inicio;
  var anio_fin = req.query.anio_fin;
  var puntuacion = req.query.puntuacion;


  if(genero){
      filtro ='join genero on pelicula.genero_id = genero.id and genero.nombre = ' + genero;
  }

  if(anio_inicio && anio_fin){
      filtro ='where fecha_lanzamiento >= ' + anio_inicio + ' and fecha_lanzamiento <= ' + anio_fin;  
  }
  
  if(puntuacion){
     filtro =' where puntuacion >=' + puntuacion;
    
  }

  con.query(sql, function(error, resultado, fields) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      var response = {
          'peliculas': resultado
      };

      res.send(JSON.stringify(response));
  });
}


module.exports = {
    buscarPeliculas: buscarPeliculas,
    buscarGeneros: buscarGeneros,
    buscarPeliculaPorID: buscarPeliculaPorID,
    buscarRecomendaciones: buscarRecomendaciones
};