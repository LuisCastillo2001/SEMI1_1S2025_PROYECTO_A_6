-- Pruebas para los procedimientos almacenados

USE SEMI1;

-- Probar sp_registrar_usuario: Registra un usuario de prueba
CALL sp_registrar_usuario('usuario_prueba', 'prueba@example.com', 'password123', 'http://example.com/foto.jpg');

-- Probar sp_iniciar_sesion: Inicia sesión del usuario registrado (se esperan datos del usuario)
CALL sp_iniciar_sesion('prueba@example.com', 'password123');

-- Probar sp_registrar_seccion: Registra una sección para el usuario con id 1 (ajusta el id si es necesario)
CALL sp_registrar_seccion('Seccion Prueba', 'Descripción de la sección de prueba', 1);

-- Probar sp_obtener_secciones: Obtiene todas las secciones
CALL sp_obtener_secciones();

-- Probar sp_registrar_archivo: Registra un archivo en la sección con id 1
CALL sp_registrar_archivo('archivo_prueba.pdf', 'Pdf', 'http://example.com/archivo.pdf', 1);

-- Probar sp_obtener_archivos_seccion: Obtiene los archivos de la sección con id 1
CALL sp_obtener_archivos_seccion(1);

-- Probar sp_registrar_archivo_escaneado: Actualiza el texto escaneado del archivo con id 1
CALL sp_registrar_archivo_escaneado(1, 'Texto escaneado de prueba');

-- Probar sp_registrar_archivo_traducido: Actualiza el texto traducido del archivo con id 1
CALL sp_registrar_archivo_traducido(1, 'Texto traducido de prueba');

-- Probar visualizar_archivo: Muestra la información del archivo con id 1
CALL visualizar_archivo(1);
