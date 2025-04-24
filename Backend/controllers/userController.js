import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import connectionDB from '../DB/dbconnection.js';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { RekognitionClient, DetectTextCommand } from '@aws-sdk/client-rekognition'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extName) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG)'));
    }
});

dotenv.config({ path: path.join(__dirname, '.env') });

// Configuracion para el cliente de Rekognition
const rekognition = new RekognitionClient({
    region: process.env.AWS_REGION, // Usar la variable de entorno para la región
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Usar la variable de entorno para el access key
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Usar la variable de entorno para el secret key
    }
  });

// Registrar usuario
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre_usuario, correo, contrasenia } = req.body;
        
        const foto = req.file;
        let url_foto = null;
        if (foto) {
        
            const base64Content = foto.buffer.toString('base64');
            
            const response = await fetch('https://4d7varhp9c.execute-api.us-east-1.amazonaws.com/UploadImageP1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: foto.originalname,
                    fileContent: base64Content
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al subir la imagen al Lambda');
            }
            
            const data = await response.json();
            console.log(data)
            url_foto = data.fileUrl; // se usa el campo "fileUrl"
        }
        
        const query = `CALL sp_registrar_usuario(?, ?, ?, ?)`; // Updated procedure name
        connectionDB.query(query, [nombre_usuario, correo, contrasenia, url_foto], (err) => {
            if (err) {
                // Manejar errores de duplicados
                if (err.code === 'ER_DUP_ENTRY') {
                    const field = err.sqlMessage.includes('correo') ? 'correo' : 'nombre_usuario';
                    return res.status(400).json({ error: `El ${field} ya está registrado. Por favor, usa otro.` });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ mensaje: 'Usuario registrado exitosamente', url_foto });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Iniciar sesión
export const iniciarSesion = (req, res) => {
    const { correo, contrasenia } = req.body
    const sql = "CALL sp_iniciar_sesion(?, ?)"
    connectionDB.query(sql, [correo, contrasenia], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json(results[0])
    })
}

// Registrar sección
export const registrarSeccion = (req, res) => {
    const { titulo_seccion, descripcion_seccion, id_usuario } = req.body
    const sql = "CALL sp_registrar_seccion(?, ?, ?)"
    connectionDB.query(sql, [titulo_seccion, descripcion_seccion, id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message })
        res.json({ mensaje: "Sección registrada exitosamente", results })
    })
}

// Obtener secciones por usuario
export const obtenerSeccionesPorUsuario = (req, res) => {
    const { id_usuario } = req.params;
    const sql = "CALL sp_obtener_secciones_por_usuario(?)";
    connectionDB.query(sql, [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

// Registrar archivo
export const registrarArchivo = async (req, res) => {
    try {
        let { nombre_archivo, tipo, id_seccion } = req.body;
        console.log(tipo)
        let url_archivo = req.body.url_archivo || null;
        if (req.file) {
            if (tipo === 'Imagen') {
                const base64Content = req.file.buffer.toString('base64');
                const response = await fetch('https://4d7varhp9c.execute-api.us-east-1.amazonaws.com/UploadImageP1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: req.file.originalname,
                        fileContent: base64Content
                    })
                });
                if (!response.ok) throw new Error('Error al subir la imagen al Lambda');
                const data = await response.json();
                url_archivo = data.fileUrl;
            } else if (tipo === 'PDF') {
                const base64Content = req.file.buffer.toString('base64');
                const response = await fetch('https://4d7varhp9c.execute-api.us-east-1.amazonaws.com/uploadFileP1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: req.file.originalname,
                        fileContent: base64Content
                    })
                });
                if (!response.ok) throw new Error('Error al subir el PDF al Lambda');
                const data = await response.json();
                url_archivo = data.fileUrl;
            }
        }
        //console.log({ nombre_archivo, tipo, url_archivo, id_seccion });
        const query = "CALL sp_registrar_archivo(?, ?, ?, ?)";
        connectionDB.query(query, [nombre_archivo, tipo, url_archivo, id_seccion], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Archivo registrado exitosamente", results });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener archivos de una sección
export const obtenerArchivosSeccion = (req, res) => {
    const { id_seccion } = req.params;
    const sql = "CALL sp_obtener_archivos_seccion(?)";
    connectionDB.query(sql, [id_seccion], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

// Actualizar texto escaneado (OCR)
export const actualizarTextoEscaneado = (req, res) => {
    const { id_archivo } = req.params;
    const { texto_escaneado } = req.body;
    const sql = "CALL sp_registrar_archivo_escaneado(?, ?)";
    connectionDB.query(sql, [id_archivo, texto_escaneado], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Texto OCR actualizado", results });
    });
};

// Actualizar texto traducido
export const actualizarTextoTraducido = (req, res) => {
    const { id_archivo } = req.params;
    const { texto_traducido } = req.body;
    const sql = "CALL sp_registrar_archivo_traducido(?, ?)";
    connectionDB.query(sql, [id_archivo, texto_traducido], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Texto traducido actualizado", results });
    });
};

// Visualizar archivo
export const visualizarArchivo = (req, res) => {
    const { id_archivo } = req.params;
    const sql = "CALL visualizar_archivo(?)";
    connectionDB.query(sql, [id_archivo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

export const visualizarPDF = async (req, res) => {
    const { id_archivo } = req.params;
    const sql = "CALL visualizar_archivo(?)";
    connectionDB.query(sql, [id_archivo], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        const archivo = results[0][0];
        if (archivo && archivo.tipo === 'Pdf') {
            try {
                const response = await fetch(archivo.url_archivo);
                if (!response.ok) throw new Error('Error al obtener el archivo PDF');
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline');
                response.body.pipe(res);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(404).json({ error: 'Archivo no encontrado o no es un PDF' });
        }
    });
};

export const translateText = async (req, res) => {
    const { text, source_language, target_language } = req.body;

    try {
        const response = await fetch('https://4d7varhp9c.execute-api.us-east-1.amazonaws.com/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, source_language, target_language }),
        });

        if (!response.ok) {
            throw new Error('Error al traducir el texto');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const extraerDatosArchivo = async (req, res) => {
    const { id_archivo } = req.params;
  
    const sql = "CALL visualizar_archivo(?)";
    connectionDB.query(sql, [id_archivo], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
      const archivo = results[0][0];
      if (!archivo || !archivo.url_archivo || archivo.tipo.toLowerCase() !== 'imagen') {
        return res.status(400).json({ error: 'El archivo no existe, no es una imagen o no tiene URL' });
      }
  
      const url = archivo.url_archivo;
      const match = url.match(/^https?:\/\/([^.]+)\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com\/(.+)$/);
      if (!match) {
        return res.status(400).json({ error: 'No se pudo extraer bucket y key de la URL' });
      }
  
      const bucket = match[1];
      const key = decodeURIComponent(match[2]);
  
      const params = {
        Image: {
          S3Object: {
            Bucket: bucket,
            Name: key
          }
        }
      };
  
      try {
        // Crear el comando de DetectText
        const command = new DetectTextCommand(params);
        const data = await rekognition.send(command); // Esperar la respuesta de Rekognition
  
        const textoDetectado = data.TextDetections
          .filter(item => item.Type === 'LINE')
          .map(item => item.DetectedText)
          .join('\n');
  
        // Llamar al procedimiento almacenado para guardar el texto extraído
        const updateSql = "CALL sp_registrar_archivo_escaneado(?, ?)";
        connectionDB.query(updateSql, [id_archivo, textoDetectado], (updateErr, updateResults) => {
          if (updateErr) {
            return res.status(500).json({ error: 'Error al actualizar el texto en la base de datos', detail: updateErr.message });
          }
  
          // Responder con los datos actualizados
          res.json({
            mensaje: 'Texto extraído y almacenado correctamente',
            texto_extraido: textoDetectado
          });
        });
  
      } catch (rekogErr) {
        console.error("Error con Rekognition:", rekogErr);
        return res.status(500).json({ error: 'Error al detectar texto con Rekognition' });
      }
    });
  };