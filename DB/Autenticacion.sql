USE SEMI1;

DELIMITER $$
CREATE PROCEDURE sp_registrar_usuario(
    IN p_nombre_usuario VARCHAR(100),
    IN p_correo VARCHAR(100),
    IN p_contrasenia VARCHAR(290),
    IN p_url_foto TEXT
)
BEGIN
    
    INSERT INTO usuarios (nombre_usuario, correo, contrasenia, url_foto)
    VALUES (p_nombre_usuario, p_correo, SHA2(p_contrasenia, 256), p_url_foto);

    
END$$
DELIMITER ;

DELIMITER $$
-- Procedimiento para iniciar sesión

CREATE PROCEDURE sp_iniciar_sesion(
    IN p_correo VARCHAR(100),
    IN p_contrasenia VARCHAR(290)
)
BEGIN
    DECLARE v_id_usuario INT;
    DECLARE v_nombre_usuario VARCHAR(100);
    DECLARE v_url_foto TEXT;

    SELECT id_usuario, nombre_usuario, url_foto
    INTO v_id_usuario, v_nombre_usuario, v_url_foto
    FROM usuarios
    WHERE correo = p_correo AND contrasenia = SHA2(p_contrasenia, 256);

    IF v_id_usuario IS NOT NULL THEN
        SELECT v_id_usuario AS id_usuario, v_nombre_usuario AS nombre_usuario, v_url_foto AS url_foto;
    ELSE
        SELECT NULL AS id_usuario, NULL AS nombre_usuario, NULL AS url_foto;
    END IF;
END$$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_actualizarUser(
    IN p_nombre_usuario VARCHAR(100),
    IN p_url_foto TEXT,
    IN p_id_usuario INT
)
BEGIN
    -- Si se envía una nueva URL de foto (no NULL), se actualiza todo
    IF p_url_foto IS NOT NULL THEN
        UPDATE usuarios
        SET nombre_usuario = p_nombre_usuario,
            url_foto = p_url_foto
        WHERE id_usuario = p_id_usuario;
    ELSE
        -- Solo se actualiza el nombre de usuario
        UPDATE usuarios
        SET nombre_usuario = p_nombre_usuario
        WHERE id_usuario = p_id_usuario;
    END IF;
END $$

DELIMITER ;



