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
  let id = req.params.id;
    let sqlPelicula = `SELECT * FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id WHERE pelicula.id = ${id}`; // Query para obtener datos de película y el género. //

        con.query(sqlPelicula, (error, resultado, fields) => {
            // Se chequea que el id ingresado sea un número. //
            if(typeof Number(id) !== 'number' || isNaN(Number(id))){
                console.log("El id debe ser un número.", error.message);
                return res.status(400).send("El id debe ser un número.");
            };

            if (error) {
                console.log("Hubo un error en la consulta.", error.message);
                return res.status(404).send("Hubo un error en la consulta.");
            }

            if (resultado.length == 0) {
                console.log("No se encontró ninguna película con ese id.")
                return res.status(404).send("No se encontró ninguna película con ese id.");
            }

                // Si no hay ningún error, se crea el objeto respuesta. //
                let response = {
                    pelicula: resultado[0],
                    genero: resultado[0].nombre,
                    actores: ""
                };


    let sqlActores = `SELECT actor.nombre FROM pelicula INNER JOIN actor_pelicula ON pelicula.id=actor_pelicula.pelicula_id INNER JOIN actor ON actor.id = actor_pelicula.actor_id WHERE pelicula.id = ${id}`; // Query para obtener los actores de la película correspondiente. //

        con.query(sqlActores, (error, resultadoActores, fields) => {
            if (error) {
                console.log("Hubo un error en la consulta.", error.message);
                return res.status(404).send("Hubo un error en la consulta.");
            };

                // Se agregan los actores al objeto respuesta. //
                response.actores = resultadoActores;

                // Se envía la respuesta. //
                res.send(JSON.stringify(response));
        });
    })   
};


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