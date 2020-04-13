CREATE DATABASE que_veo_hoy;

USE que_veo_hoy;


CREATE TABLE pelicula(
	id int not null primary key auto_increment
    titulo varchar(100),
    anio int,
    duracion int,
    director varchar(400),
    fecha_lanzamiento date,
    puntuacion int,
    poster varchar(300),
    trama varchar(700)
);

CREATE TABLE genero (
  id int AUTO_INCREMENT,
  nombre varchar(30),
  PRIMARY KEY (id)
);

ALTER TABLE pelicula
ADD COLUMN genero_id int not null;

CREATE TABLE actor (
   id int(11) NOT NULL AUTO_INCREMENT,
   nombre varchar(100) NOT NULL, 
  PRIMARY KEY (id)
);

CREATE TABLE actor_pelicula (
  id int(11) NOT NULL AUTO_INCREMENT,
  actor_id int NOT NULL, 
  pelicula_id int NOT NULL, 
  FOREIGN KEY (actor_id) REFERENCES actor(id),
  FOREIGN KEY (pelicula_id) REFERENCES pelicula (id),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
