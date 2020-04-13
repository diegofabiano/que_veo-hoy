var con = require('../lib/conexionbd');

function buscarPeliculas(req) {
    var sql = " from pelicula";
    var hayFiltro = false;
  
    if (req.query.titulo || req.query.genero || req.query.anio) {
      sql = sql.concat(" where ");
  
      if (req.query.titulo) {
        sql = sql.concat('titulo like "%'  + req.query.titulo + '%"');
        hayFiltro = true;
      }
  
      if (req.query.genero) {
        if (hayFiltro) {
          sql = sql.concat(" and ");
        }
        sql = sql.concat(" genero_id = " + req.query.genero);
        hayFiltro = true;
      }
  
      if (req.query.anio) {
        if (hayFiltro) {
          sql = sql.concat(" and ");
        }
        sql = sql.concat(" anio = " + req.query.anio);
      }
    }
    if (req.query.tipo_orden) {
      sql = sql.concat(
        " order by " + req.query.columna_orden + " " + req.query.tipo_orden
      );
    }
    if (req.query.cantidad) {
      sql = sql.concat(" limit 0," + req.query.cantidad);
    }
    sql = sql.concat(";");
    return sql;
  }
  
  function buscarPeliculaPorId(id, res) {
    var sql =
      "SELECT * FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id JOIN actor ON actor_pelicula.actor_id = actor.id where pelicula.id=" +
      id +
      ";";
    con.query(sql, function(error, resultado) {
      var generoSql =
        "SELECT * FROM genero where id=" + resultado[0].genero_id + ";";
      con.query(generoSql, function(error, resultadoGenero) {
        var actores = [];
        var pelicula = {
          titulo: resultado[0].titulo,
          duracion: resultado[0].duracion,
          director: resultado[0].director,
          poster: resultado[0].poster,
          anio: resultado[0].anio,
          fecha_lanzamiento: resultado[0].fecha_lanzamiento,
          trama: resultado[0].trama,
          puntuacion: resultado[0].puntuacion,
          nombre: resultadoGenero[0].nombre
        };
        resultado.forEach(element => {
          actores.push(element);
        });
        var respuesta = {
          pelicula: pelicula,
          actores: actores
        };
        res.send(respuesta);
      });
    });
  }
  
  function devolverTodas(req, res) {
    var query = armarConsulta(req);
    var sql = "select *".concat(query);
    var count = "select count(id) as total".concat(query);
    con.query(sql, function(error, resultado) {
      con.query(count, function(errorCount, resultadoCount) {
        var respuesta = {
          peliculas: resultado,
          total: resultadoCount[0].total
        };
  
        res.send(respuesta);
      });
    });
  }
  
  function buscarGeneros(req, res) {
    var sql = "select * from genero";
    con.query(sql, function(error, resultado) {
      var respuesta = {
        generos: resultado
      };
  
      res.send(respuesta);
    });
  }
  
  function buscarRecomendaciones(req, res) {
    var anioInicio = req.query.anio_inicio;
    var anioFin = req.query.anio_fin;
    var multiReqs = false;
    var sql =
      "SELECT * FROM pelicula JOIN genero ON pelicula.genero_id=genero.id ";
    if (
      req.query.puntuacion ||
      (req.query.anio_inicio && req.query.anio_fin) ||
      req.query.genero
    ) {
      sql = sql.concat("where");
      if (req.query.puntuacion) {
        sql = sql.concat(" puntuacion > " + req.query.puntuacion);
        multiReqs = true;
      }
      if (req.query.anio_inicio && req.query.anio_fin) {
        if (multiReqs) {
          sql = sql.concat(" AND");
        }
        sql = sql.concat(
          " anio BETWEEN " + req.query.anio_inicio + " AND " + req.query.anio_fin
        );
        multiReqs = true;
      }
      if (req.query.genero) {
        if (multiReqs) {
          sql = sql.concat(" AND");
        }
        sql = sql.concat(" nombre='" + req.query.genero + "'");
      }
    }
    sql = sql.concat(";");
  
    con.query(sql, function(error, resultado) {
      var respuesta = {
        peliculas: resultado
      };
      res.send(respuesta);
    });
  }
  module.exports = {
    devolverTodas: devolverTodas,
    buscarPeliculas: buscarPeliculas,
    buscarGeneros: buscarGeneros,
    buscarPeliculaPorId: buscarPeliculaPorId,
    buscarRecomendaciones: buscarRecomendaciones
  };