var con = require('../lib/conexionbd');


function buscarPeliculas(req, res) {
    var sql = "SELECT * FROM pelicula WHERE 1=1";

    var anio = req.query.anio; // Anio de realización de la película.
    var titulo = req.query.titulo; // Titulo de la película.
    var genero = req.query.genero; // Género de la peliícula.
    var columna_orden = req.query.columna_orden; // Columna por la que se ordena el resultado.
    var pagina = req.query.pagina; // Número de página.
    var cantidad = req.query.cantidad; // Cantidad de resultados por página.

    var limite = `${(pagina -1) * cantidad}, ${cantidad}`; // Cálculo para cantidad de resultados por página.
    var sqlTotal = "SELECT COUNT(*) AS total FROM pelicula WHERE 1=1"; // Query para obtener total de resultados enviados.
    
    // Se filtra por título y/o género y/o anio. //
    if(titulo){
        sql += ` AND titulo LIKE "\%${titulo}\%"`;
        sqlTotal += ` AND titulo LIKE "\%${titulo}\%"`;
    };

    if(genero){
        sql += ` AND genero_id = ${genero}`;
        sqlTotal += ` AND genero_id = ${genero}`;
    };

    if(anio){
        sql += ` AND anio = ${anio}`;
        sqlTotal += ` AND anio = ${anio}`;
    };

    // Se ordena según el criterio pedido por el usuario. //
    switch(columna_orden){
        case 'titulo':
            sql += ` ORDER BY titulo`
            break;
        case 'anio':
            sql += ` ORDER BY anio DESC`
            break;
        case 'puntuacion':
            sql += ` ORDER BY puntuacion DESC`
            break;
        default:
        break;
    };
    
    // Se limita la cantidad de resultados por página. //
    if(pagina && cantidad){
        sql += ` LIMIT ${limite}`;
    }

    // Se realiza la consulta. //
    con.query(sql, (error, resultado, fields) => {
        if(error){
            console.log("Hubo un error en la consulta.", error.message);
            return res.status(404).send("Hubo un error en la consulta.");
        };

        let response = {
            peliculas: resultado,
            total: ""
        };

        // consulta para obtener total de resultados enviados. //
        con.query(sqlTotal, (errorTotal, resultadoTotal, fieldsTotal) => {
            if (errorTotal){
                    console.log("Hubo un error en la consulta.", errorTotal.message);
                    return res.status(404).send("Hubo un error en la consulta.");
                 };

                 response.total = resultadoTotal[0].total;
                 res.send(JSON.stringify(response));
        });
    });
};

//funcion que obtiene los generos para enlistarlos
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

  var genero = req.query.genero;
  var anio_inicio = req.query.anio_inicio;
  var anio_fin = req.query.anio_fin;
  var puntuacion = req.query.puntuacion;
  sql = "SELECT *  FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id", 
        where = "";        

    if (genero){
        where = where + "genero.nombre = '" + genero + "'";
    }

    if (anio_inicio){
        if (genero){
            where = where + " AND ";
        }
        
        where = where + "anio >= " + anio_inicio;
    }

    if (anio_fin){
        if (genero || anio_inicio){
            where = where + " AND ";
        }
        
        where = where + "anio <= " + anio_fin;
    }

    if (puntuacion){
        if (genero || anio_inicio || anio_fin){
            where = where + " AND ";
        }
        
        where = where + "puntuacion = " + puntuacion;
    }

    if (where){
        sql = sql + " WHERE " + where;
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