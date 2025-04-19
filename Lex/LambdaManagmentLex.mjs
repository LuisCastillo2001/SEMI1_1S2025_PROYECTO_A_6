export const handler = async (event) => {
    // TODO implement
    var intention = event.sessionState.intent.name
    const response = {
      sessionState: {
        dialogAction: {
          type: "Close",
        },
        intent: {
          confirmationState: "Confirmed",
          name: intention,
          state: "Fulfilled",
        }
      },
    };
  
    if(intention == "InformacionBasica"){
      response.messages = [
        {
          contentType: "PlainText",
          content: "FileAssist es una plataforma de gestión de archivos en la nube diseñada para organizar, almacenar y procesar tus documentos de manera segura y eficiente."
        },
        {
          contentType: "PlainText",
          content: "Incluye funciones avanzadas como reconocimiento de texto en imágenes, traducción de archivos PDF y un asistente virtual integrado para resolver tus dudas."
        },
        {
          contentType: "PlainText",
          content: "FileAssist te permite:"
        },
        {
          contentType: "PlainText",
          content: "1. Crear temas (secciones) para organizar tus archivos."
        },
        {
          contentType: "PlainText",
          content: "2. Subir, visualizar y eliminar archivos."
        },
        {
          contentType: "PlainText",
          content: "3. Extraer texto de imágenes (OCR) y traducirlo."
        },
        {
          contentType: "PlainText",
          content: "4. Traducir documentos PDF a otros idiomas."
        },
        {
          contentType: "PlainText",
          content: "5. Buscar archivos mediante etiquetas."
        },
        {
          contentType: "PlainText",
          content: "6. Contar con un asistente virtual (como yo) para guiarte."
        },
        {
          contentType: "PlainText",
          content: "7. Gestionar tu perfil y acceder de forma segura con AWS Cognito."
        }
      ];
    }
    else {
      response.messages = [
        {
          contentType: "PlainText",
          content: "No se reconoce la intencion",
        },
      ]
    }
    return response;
  };
  