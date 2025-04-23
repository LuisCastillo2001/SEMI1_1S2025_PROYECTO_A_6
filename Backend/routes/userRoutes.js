import { Router } from 'express';
import { 
  registrarUsuario, 
  iniciarSesion, 
  registrarSeccion, 
  obtenerSeccionesPorUsuario, 
  registrarArchivo, 
  obtenerArchivosSeccion, 
  actualizarTextoEscaneado, 
  actualizarTextoTraducido,
  visualizarArchivo,
  visualizarPDF,
  upload,
  translateText,
  extraerDatosArchivo
} from '../controllers/userController.js';

const router = Router();

router.post('/registrar_usuario', upload.single('foto'), registrarUsuario);
router.post('/iniciar_sesion', iniciarSesion);
router.post('/registrar_seccion', registrarSeccion);
router.get('/obtener_secciones_por_usuario/:id_usuario', obtenerSeccionesPorUsuario);
router.post('/registrar_archivo', upload.single('archivo'), registrarArchivo);
router.get('/obtener_archivos_seccion/:id_seccion', obtenerArchivosSeccion);
router.put('/actualizar_texto_escaneado/:id_archivo', actualizarTextoEscaneado);
router.put('/actualizar_texto_traducido/:id_archivo', actualizarTextoTraducido);
router.get('/visualizar_archivo/:id_archivo', visualizarArchivo);
router.get('/ver_pdf/:id_archivo', visualizarPDF);
router.post('/translate', translateText);
router.get('/extraer_datos_archivo/:id_archivo', extraerDatosArchivo);

export default router;