USE SEMI1;

DELIMITER $$
-- Procedimiento para registrar una sección
CREATE PROCEDURE sp_registrar_seccion(
    IN p_titulo_seccion VARCHAR(150),
    IN p_descripcion_seccion TEXT,
    IN p_id_usuario INT
)
BEGIN
    INSERT INTO secciones (titulo_seccion, descripcion_seccion, id_usuario)
    VALUES (p_titulo_seccion, p_descripcion_seccion, p_id_usuario);
END$$

DELIMITER $$    
-- Procedimiento para obtener las secciones de un usuario
CREATE PROCEDURE sp_obtener_secciones_por_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT * FROM secciones WHERE id_usuario = p_id_usuario;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_eliminarSeccion(
    IN p_id_seccion INT
)
BEGIN
    DELETE FROM secciones WHERE id_seccion = p_id_seccion;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_eliminarArchivo(
    IN p_id_archivo INT
)
BEGIN
    DELETE FROM archivos WHERE id_archivo = p_id_archivo;
END $$

DELIMITER ;

