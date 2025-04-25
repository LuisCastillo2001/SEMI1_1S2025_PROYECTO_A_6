import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import Modal from "./Modal";
import logoImage from '../Images/logo.png'; // Import the logo image
import { signOut } from 'aws-amplify/auth'; //Para prueba 

// Icons for UI
const SectionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 5h20v14H2z"></path>
    <path d="M2 10h20"></path>
  </svg>
);

const FileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ChatbotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <circle cx="15.5" cy="8.5" r="1.5" />
    <path d="M7 13h10" />
    <path d="M9 16l3 3 3-3" />
  </svg>
);

const TranslateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 8l6 6" />
    <path d="M4 14l6-6 2 2" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="M22 22l-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);

function Dashboard() {
  // Estado de usuario
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // Estado para actualizar perfil
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    nombre_usuario: "",
    foto: null,
  });

  // Estado de secciones
  const [sections, setSections] = useState([]);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [newSection, setNewSection] = useState({ nombre: "", descripcion: "" });
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

  // Estado de archivos
  const [files, setFiles] = useState([]);
  const [newFile, setNewFile] = useState({
    nombre: "",
    tipo: "PDF",
    archivo: null,
  });
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isViewFileModalOpen, setIsViewFileModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [extractedText, setExtractedText] = useState(""); // Estado para el texto extraído

  // Estado del chatbot
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Estado de herramientas
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translateLanguage, setTranslateLanguage] = useState("es");
  const [sourceLanguage, setSourceLanguage] = useState("es");

  // Estado para OCR
  const [isOcrResultModalOpen, setIsOcrResultModalOpen] = useState(false);
  const [ocrResult, setOcrResult] = useState("");

  // Add state for text scanning
  const [textScanSuccess, setTextScanSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Cargar secciones del usuario
    obtenerSecciones(parsedUser.id_usuario);
    setUpdatedProfile({ nombre_usuario: parsedUser.nombre_usuario });
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    // Cargar archivos de la sección activa cuando cambia
    if (activeSectionId) {
      fetchFiles(activeSectionId);
    } else {
      setFiles([]);
    }
  }, [activeSectionId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedProfile({ ...updatedProfile, foto: file });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!updatedProfile.nombre_usuario) {
      setError("El nombre de usuario no puede estar vacío.");
      return;
    }

    // Obtener el usuario actual desde localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Crear un objeto para almacenar solo los campos que cambiaron
    const updatedFields = {};

    const formDataToSend = new FormData();
    formDataToSend.append("nombre_usuario", updatedProfile.nombre_usuario);
    
    if (updatedProfile.nombre_usuario !== currentUser.nombre_usuario) {
      updatedFields.nombre_usuario = updatedProfile.nombre_usuario;
    }
    
    if (updatedProfile.foto) {
      formDataToSend.append("foto", updatedProfile.foto);
      updatedFields.url_foto = updatedProfile.foto; // Solo incluir la foto si se seleccionó una nueva
    }

    // Si no hay cambios, no enviar la solicitud
    if (Object.keys(updatedFields).length === 0) {
      setNewMessage("No se realizaron cambios en el perfil.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/actualizar_perfil/${user.id_usuario}`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        setNewMessage(data.error || 'Error al actualizar usuario en la base de datos');
        return;
      }
      
      // Actualizar el usuario en localStorage con los cambios
      updatedFields.url_foto = data.url_foto;
      const updatedUser = { ...currentUser, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setNewMessage("Usuario actualizado exitosamente.");
      setTimeout(() => setNewMessage(""), 3000);
      setIsProfileModalOpen(false);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Reemplazar fetchSections para usar GET desde la API y filtrar por usuario
  const obtenerSecciones = async (idUsuario) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/obtener_secciones_por_usuario/${idUsuario}`
      );
      const data = await res.json();
      setSections(data);
      if (data.length > 0 && !activeSectionId) {
        setActiveSectionId(data[0].id_seccion);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Actualizar creación de sección usando API
  const registrarSeccion = async (e) => {
    e.preventDefault();
    if (!newSection.nombre) {
      setError("Por favor ingresa un nombre para la sección");
      return;
    }
    try {
      await fetch("http://localhost:3000/api/registrar_seccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo_seccion: newSection.nombre,
          descripcion_seccion: newSection.descripcion,
          id_usuario: user.id_usuario,
        }),
      });
      setNewSection({ nombre: "", descripcion: "" });
      setIsSectionModalOpen(false);
      obtenerSecciones(user.id_usuario);
      setSuccess("Sección creada exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  // Usar endpoint para obtener archivos de una sección
  const fetchFiles = async (sectionId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/obtener_archivos_seccion/${sectionId}`
      );
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      setError(error.message);
    }
  };

  // Actualizar subida de archivo usando FormData y endpoint
  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (
      !newFile.nombre ||
      !newFile.tipo ||
      !newFile.archivo ||
      !activeSectionId
    ) {
      setError("Por favor completa todos los campos y selecciona una sección");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("nombre_archivo", newFile.nombre);
    formDataToSend.append("tipo", newFile.tipo);
    formDataToSend.append("id_seccion", activeSectionId);
    formDataToSend.append("archivo", newFile.archivo);
    try {
      await fetch("http://localhost:3000/api/registrar_archivo", {
        method: "POST",
        body: formDataToSend,
      });
      fetchFiles(activeSectionId);
      setIsFileModalOpen(false);
      setSuccess("Archivo subido exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  // Actualizar acción de OCR y traducción usando PUT
  const handleFileAction = async (file, action) => {
    let updatedFile = { ...file };
    if (action === "translate" && file.tipo === "PDF") {
      updatedFile.traducido = true;
      updatedFile.contenido_traducido =
        "Este es el contenido traducido simulado del PDF.";
      try {
        await fetch(
          `http://localhost:3000/api/files/translate/${file.id_archivo}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              texto_traducido: updatedFile.contenido_traducido,
            }),
          }
        );
        setSuccess("PDF traducido exitosamente");
        setTimeout(() => setSuccess(""), 3000);
        fetchFiles(activeSectionId);
      } catch (error) {
        setError(error.message);
      }
    } else if (action === "ocr") {
      const textoExtraido =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi...";
      updatedFile.ocr_aplicado = true;
      updatedFile.texto_extraido = textoExtraido;
      try {
        await fetch(`http://localhost:3000/api/files/ocr/${file.id_archivo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto_escaneado: textoExtraido }),
        });
        setSuccess("Texto extraído exitosamente");
        setTimeout(() => setSuccess(""), 3000);
        fetchFiles(activeSectionId);
        setViewingFile(updatedFile);
        if (file.tipo === "PDF") {
          const blob = new Blob([textoExtraido], { type: "text/plain" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${file.nombre}-ocr.txt`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    setError("La funcionalidad para eliminar secciones no está disponible.");
  };

  const handleDeleteFile = async (fileId) => {
    setError("La funcionalidad para eliminar archivos no está disponible.");
  };

  const handleViewFile = (file) => {
    setViewingFile(file);
    setIsViewFileModalOpen(true); // Open the modal for both PDFs and images
  };

  const handleConvertToText = async (file) => {
    alert(`Convirtiendo a texto un archivo de tipo: ${file.tipo}`);

    try {
      const response = await fetch(
        `http://localhost:3000/api/extraer_datos_archivo/${file.id_archivo}`
      );
      if (!response.ok) {
        throw new Error("Error al extraer datos del archivo");
      }

      const data = await response.json();
      setExtractedText(data.texto_extraido);
      console.log(data);
    } catch (error) {
      alert("Hubo un error al extraer los datos del archivo.");
    }
  };

  const handleScanText = (file) => {
    // Simulating text scanning process
    setTimeout(() => {
      setTextScanSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setTextScanSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = { sender: "user", text: newMessage };
    setChatMessages((prev) => [...prev, userMessage]);
    let text = newMessage;
    setNewMessage("");

    let mysections = sections.map((sect) => sect.titulo_seccion);
    // console.log(mysections)

    try {
      const response = await fetch(
        "https://m1zqnckrfa.execute-api.us-east-1.amazonaws.com/message_bot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // text: newMessage,
            text,
            sessionId: user.nombre_usuario.replace(/\s+/g, ""),
            // sessionId: "521985"
            user: user.nombre_usuario,
            sections: mysections.join("|"),
          }),
        }
      );

      const data = await response.json();

      if (data.messages && Array.isArray(data.messages)) {
        const botMessages = data.messages.map((msg) => ({
          sender: "bot",
          text: msg.content,
        }));

        setChatMessages((prev) => [...prev, ...botMessages]);
      } else {
        // Fallback en caso de que no haya mensajes válidos
        const fallbackMessage = {
          sender: "bot",
          text: "Lo siento, hubo un problema al procesar tu mensaje.",
        };
        setChatMessages((prev) => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error("Error al enviar mensaje al bot:", error);
      const errorMessage = {
        sender: "bot",
        text: "Hubo un error al contactar al asistente. Por favor, intenta de nuevo más tarde.",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleTranslateSubmit = async (e) => {
    e.preventDefault();
    if (!textToTranslate.trim()) return;

    try {
      const response = await fetch("http://localhost:3000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToTranslate,
          source_language: sourceLanguage,
          target_language: translateLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al traducir el texto");
      }

      const data = await response.json();
      setTranslatedText(data.texto_traducido);
      setSuccess("Texto traducido exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleLogout = async() => {
    try {
      await signOut(); // Cierra la sesión en Cognito
      localStorage.removeItem('user'); 
      localStorage.removeItem('token');
      console.log('Sesión cerrada exitosamente.');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      console.log('Error al cerrar sesión. Intenta nuevamente.');
    }
    
  };

  if (loading && !user) {
    return <div className="loading">Cargando...</div>;
  }

  const activeSection = sections.find(
    (section) => section.id_seccion === activeSectionId
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={logoImage} alt="Logo" className="header-logo" />
            <h2>FILEASSIST</h2>
          </div>
          {user && (
            <div className="sidebar-user">
              <img
                src={user.url_foto}
                alt={user.nombre_usuario}
                className="user-avatar"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40";
                }} // Fallback image
              />
              <span>{user.nombre_usuario}</span>
            </div>
          )}
          <button
            className="update-profile-button"
            onClick={() => setIsProfileModalOpen(true)}
          >
            Actualizar Perfil
          </button>
          <button
            className="add-sections-button"
            onClick={() => setIsSectionModalOpen(true)}
          >
            Agregar Secciones
          </button>
        </div>

        <div className="sections-header">
          <h3>Mis Secciones</h3>
        </div>

        <nav className="sidebar-nav">
          {sections.length === 0 ? (
            <div className="empty-sections-note">
              No tienes secciones. ¡Crea una!
            </div>
          ) : (
            sections.map((section) => (
              <button
                key={section.id_seccion}
                className={`nav-item ${
                  activeSectionId === section.id_seccion ? "active" : ""
                }`}
                onClick={() => setActiveSectionId(section.id_seccion)}
              >
                <SectionIcon />
                <span className="section-name">{section.titulo_seccion}</span>
              </button>
            ))
          )}
        </nav>

        <div className="sidebar-tools">
          <h3>Herramientas</h3>
          <button
            className="tool-button"
            onClick={() => setIsTranslateModalOpen(true)}
          >
            <TranslateIcon />
            <span>Traducir Texto</span>
          </button>
          <button className="tool-button" onClick={() => setIsChatOpen(true)}>
            <ChatbotIcon />
            <span>Asistente Virtual</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>
            {activeSection
              ? activeSection.titulo_seccion
              : "Bienvenido a FILEASSIST"}
          </h1>
        </header>

        {activeSection && (
          <div className="section-actions">
            <button
              className="action-button create-button"
              onClick={() => setIsFileModalOpen(true)}
            >
              Subir Archivo
            </button>
          </div>
        )}

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="content-body">
          {files.length === 0 ? (
            <div className="empty-state">
              <h3>No hay archivos en esta sección</h3>
              <p>Sube un nuevo archivo para comenzar</p>
              <button
                className="action-button"
                onClick={() => setIsFileModalOpen(true)}
              >
                Subir Archivo
              </button>
            </div>
          ) : (
            <div className="file-grid">
              {files.map((file) => (
                <div key={file.id_archivo} className="file-card">
                  <div className="file-card-header">
                    <h4>{file.nombre_archivo}</h4>
                    <span className="file-type">{file.tipo}</span>
                  </div>
                  <div className="file-card-body">
                    {file.tipo === "Pdf" && (
                      <div className="file-pdf-icon">
                        <FileIcon />
                        <span className="file-extension">PDF</span>
                      </div>
                    )}
                    {file.tipo === "Imagen" && (
                      <img
                        src={file.url_archivo}
                        alt={file.nombre_archivo}
                        className="file-thumbnail"
                      />
                    )}
                  </div>
                  <div className="file-card-actions">
                    <button
                      className="view-button"
                      onClick={() => handleViewFile(file)}
                    >
                      Ver archivo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal para crear nueva sección */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => {
          setIsSectionModalOpen(false);
          setError(null);
        }}
        title="Crear Nueva Sección"
      >
        <form onSubmit={registrarSeccion} className="section-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Sección</label>
            <input
              id="nombre"
              type="text"
              value={newSection.nombre}
              onChange={(e) =>
                setNewSection({ ...newSection, nombre: e.target.value })
              }
              placeholder="Ej: Proyectos, Estudios, Trabajo..."
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción (opcional)</label>
            <textarea
              id="descripcion"
              value={newSection.descripcion}
              onChange={(e) =>
                setNewSection({ ...newSection, descripcion: e.target.value })
              }
              placeholder="Describe el contenido de esta sección"
              rows="4"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsSectionModalOpen(false);
                setError(null);
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Crear Sección
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para subir archivo */}
      <Modal
        isOpen={isFileModalOpen}
        onClose={() => {
          setIsFileModalOpen(false);
          setError(null);
        }}
        title="Subir Nuevo Archivo"
      >
        <form onSubmit={handleFileSubmit} className="file-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del archivo</label>
            <input
              id="nombre"
              type="text"
              value={newFile.nombre}
              onChange={(e) =>
                setNewFile({ ...newFile, nombre: e.target.value })
              }
              placeholder="Nombre del archivo"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo">Tipo de archivo</label>
            <select
              id="tipo"
              value={newFile.tipo}
              onChange={(e) => setNewFile({ ...newFile, tipo: e.target.value })}
              required
            >
              <option value="PDF">Archivo PDF</option>
              <option value="Imagen">Imagen</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="archivo">Archivo</label>
            <input
              id="archivo"
              type="file"
              onChange={(e) =>
                setNewFile({ ...newFile, archivo: e.target.files[0] })
              }
              accept=".jpg,.jpeg,.png,.pdf"
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => {
                setIsFileModalOpen(false);
                setError(null);
              }}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Subir
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver archivo */}
      <Modal
        isOpen={isViewFileModalOpen}
        onClose={() => {
          setIsViewFileModalOpen(false);
          setViewingFile(null);
        }}
        title={`Ver Archivo: ${viewingFile?.nombre_archivo}`}
        wide={true}
      >
        <div className="file-viewer">
          {viewingFile?.tipo === "Pdf" && (
            <>
              <iframe
                src={`http://localhost:3000/api/ver_pdf/${viewingFile.id_archivo}`}
                title={viewingFile.nombre_archivo}
                style={{ width: "100%", height: "80vh", border: "none" }}
              ></iframe>
              <button
                className="action-button"
                onClick={() => handleConvertToText(viewingFile)}
              >
                Convertir a Texto
              </button>
            </>
          )}
          {viewingFile?.tipo === "Imagen" && (
            <>
              <img
                src={viewingFile.url_archivo}
                alt={viewingFile.nombre_archivo}
                className="image-full"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
              {!viewingFile?.texto_escaneado && (
                <button
                  className="action-button"
                  onClick={() => handleConvertToText(viewingFile)}
                >
                  Convertir a Texto
                </button>
              )}
            </>
          )}

          <div className="file-viewer-text styled-text-box">
            {viewingFile?.texto_escaneado ? (
              <>
                <h3>Texto Escaneado:</h3>
                <p>{viewingFile.texto_escaneado}</p>
              </>
            ) : extractedText ? (
              <>
                <h3>Texto Extraído:</h3>
                <p>{extractedText}</p>
              </>
            ) : (
              <p className="no-text">No se ha extraído ningún texto aún.</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal para resultados OCR */}
      <Modal
        isOpen={isOcrResultModalOpen}
        onClose={() => setIsOcrResultModalOpen(false)}
        title="Texto Extraído (OCR)"
        wide={true}
      >
        <div className="ocr-result-container">
          <pre className="ocr-result-text">
            {viewingFile?.texto_extraido || ocrResult}
          </pre>
          <div className="form-actions">
            <button
              className="action-button"
              onClick={() => {
                // Copiar al portapapeles
                navigator.clipboard.writeText(
                  viewingFile?.texto_extraido || ocrResult
                );
                setSuccess("Texto copiado al portapapeles");
                setTimeout(() => setSuccess(""), 2000);
              }}
            >
              Copiar al portapapeles
            </button>
          </div>
        </div>
      </Modal>

     {/* Modal para actualizar perfil */}
     <Modal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setError(null);
        }}
        title="Actualizar Perfil"
      >
        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="nombre_usuario">Nombre de Usuario</label>
            <input
              id="nombre_usuario"
              type="text"
              name="nombre_usuario"
              value={updatedProfile.nombre_usuario}
              onChange={handleProfileChange}
              placeholder="Nuevo nombre de usuario"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="foto">Foto de Perfil</label>
            <input
              id="foto"
              type="file"
              name="foto"
              accept=".jpg,.jpeg,.png"
              onChange={handleProfileFileChange}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsProfileModalOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Actualizar
            </button>
          </div>
        </form>
      </Modal>

      {/* Chatbot */}
      <div className={`chatbot ${isChatOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <h3>Asistente Virtual</h3>
          <button className="close-chat" onClick={() => setIsChatOpen(false)}>
            ×
          </button>
        </div>
        <div className="chatbot-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}
        </div>
        <form className="chatbot-input" onSubmit={handleChatSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <button type="submit">Enviar</button>
          {/* boton para enviar el texto del chat */}
        </form>
      </div>

      {/* Botón flotante para abrir el chat */}
      {!isChatOpen && (
        <button className="chat-fab" onClick={() => setIsChatOpen(true)}>
          <ChatbotIcon />
        </button>
      )}

      {/* Modal para traducción */}
      <Modal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        title="Traducir Texto"
      >
        <form onSubmit={handleTranslateSubmit} className="translate-form">
          <div className="form-group">
            <label htmlFor="idioma-origen">Idioma Original</label>
            <select
              id="idioma-origen"
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="fr">Francés</option>
              <option value="de">Alemán</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="texto-original">Texto Original</label>
            <textarea
              id="texto-original"
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              placeholder="Ingresa el texto que deseas traducir"
              rows="5"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="idioma">Traducir a</label>
            <select
              id="idioma"
              value={translateLanguage}
              onChange={(e) => setTranslateLanguage(e.target.value)}
            >
              <option value="en">Inglés</option>
              <option value="es">Español</option>
              <option value="fr">Francés</option>
              <option value="de">Alemán</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            Traducir
          </button>

          {translatedText && (
            <div className="translation-result">
              <h4>Resultado:</h4>
              <p>{translatedText}</p>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
