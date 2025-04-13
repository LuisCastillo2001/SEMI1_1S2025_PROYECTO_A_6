DROP DATABASE IF EXISTS SEMI1;
CREATE DATABASE SEMI1;
USE SEMI1;

CREATE TABLE usuarios(
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) UNIQUE NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasenia VARCHAR(290) NOT NULL,
    url_foto TEXT NOT NULL
);

CREATE TABLE secciones(
	id_seccion INT AUTO_INCREMENT PRIMARY KEY,
    titulo_seccion VARCHAR(150) NOT NULL,
    descripcion_seccion TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL
);


CREATE TABLE archivos(
	id_archivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(150) NOT NULL,
    tipo ENUM('Imagen','Pdf') NOT NULL,
    url_archivo TEXT NOT NULL,
    texto_escaneado TEXT DEFAULT NULL,
    texto_traducido TEXT DEFAULT NULL,
    id_seccion INT NOT NULL
);


ALTER TABLE secciones ADD CONSTRAINT fk_usuario_seccion FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE archivos ADD CONSTRAINT fk_seccion_archivo FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion) ON DELETE CASCADE ON UPDATE CASCADE;
