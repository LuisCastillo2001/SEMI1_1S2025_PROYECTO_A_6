USE SEMI1;

DELIMITER $$
-- Procedimiento para obtener los archivos de una sección
CREATE PROCEDURE sp_obtener_archivos_seccion(
    IN p_id_seccion INT
)
BEGIN
    SELECT * FROM archivos WHERE id_seccion = p_id_seccion;
END$$



DELIMITER $$
-- Procedimiento para registrar un archivo
CREATE PROCEDURE sp_registrar_archivo(
    IN p_nombre_archivo VARCHAR(150),
    IN p_tipo ENUM('Imagen','Pdf'),
    IN p_url_archivo TEXT,
    IN p_id_seccion INT
)
BEGIN
    INSERT INTO archivos (nombre_archivo, tipo, url_archivo, id_seccion)
    VALUES (p_nombre_archivo, p_tipo, p_url_archivo, p_id_seccion);
END$$


CREATE PROCEDURE sp_registrar_archivo_escaneado(
    
    IN p_id_archivo INT,
    IN p_texto_escaneado TEXT
)
BEGIN
    UPDATE archivos SET texto_escaneado = p_texto_escaneado WHERE id_archivo = p_id_archivo;
END$$



CREATE PROCEDURE sp_registrar_archivo_traducido(
    
    IN p_id_archivo INT,
    IN p_texto_traducido TEXT
)
BEGIN
    UPDATE archivos SET texto_traducido = p_texto_traducido WHERE id_archivo = p_id_archivo;
END$$


CREATE PROCEDURE visualizar_archivo(
    IN p_id_archivo INT
)
BEGIN
    SELECT * FROM archivos WHERE id_archivo = p_id_archivo;
END$$

DELIMITER ;
