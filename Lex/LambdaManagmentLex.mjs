export const handler = async (event) => {
  // TODO implement
  var intention = event.sessionState.intent.name
  const sessionAttributes = event.sessionState.sessionAttributes || {};
  const nombre = sessionAttributes.nombre || "usuario";
  const sectionsRaw = sessionAttributes.sections || '';
  const sections = sectionsRaw ? sectionsRaw.split('|') : [];
  const response = {
    sessionState: {
      sessionAttributes,
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

  let mySections = "\n"
  if (sections.length === 0) {
    mySections += 'Actualemente no tienes ninguna Seccion.'
  } else {
    mySections += "Actualmente tienes estas Secciones:"
    sections.forEach(sect => {
      mySections += "\n" + sect
    });
  }

  if(intention == "InformacionBasica"){
    response.messages = [
      {
        contentType: "PlainText",
        content: `FileAssist es una plataforma de gestión de archivos en la nube diseñada para organizar, almacenar y procesar tus documentos de manera segura y eficiente.`
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
  else if (intention == "Saludo") {
    response.messages = [
      {
        contentType: "PlainText",
        content: `Hola ${nombre}, como estas :)`,
      },
    ]
  }
  else if (intention == "AgregarSeccion") {
    response.messages = [
      {
        contentType: "PlainText",
        content: `Las Secciones en FileAssist se pueden ver como Carpetas, en ellas puedes:`,
      },
      {
        contentType: "PlainText",
        content: `* Subir archivos especificos realacionados al tema de la seccion`,
      },
      {
        contentType: "PlainText",
        content: `* Acceder facilmente a los archivos almacenados`,
      },
      {
        contentType: "PlainText",
        content: `Crear una seccion es algo sencillo, estos son los pasos que debes seguir ${nombre}`,
      },
      {
        contentType: "PlainText",
        content: `1) En el Sidebar de la izquierda tienes el boton verde "Agregar Secciones" Oprimelo`,
      },
      {
        contentType: "PlainText",
        content: `2) Llena los campos solicitados, el nombre de las seccion es obligatorio la descripcion es opcional`,
      },
      {
        contentType: "PlainText",
        content: `3) Termina por crear la seccion oprimiendo el boton azul "Crear Seccion"`,
      },
    ]
  }
  else if (intention == "Archivos") {
    response.messages = [
      {
        contentType: "PlainText",
        content: `Los archivos contiene informacion relacionada al tema de la seccion. \n Para Subir o Acceder un archivo necesitas TENER CREADA por lo menos alguna SECCION.`,
      },
      {
        contentType: "PlainText",
        content: `Para SUBIR UN ARCHIVO debes seguir estos pasos:`,
      },
      {
        contentType: "PlainText",
        content: `1) Ingresar a la Seccion donde quieres agregar el archivo, puedes ver tus secciones en el sidebar izquierdo en el apartado "Mis Secciones". ${mySections} `,
      },
      {
        contentType: "PlainText",
        content: `2) Dentro de la seccion oprime el boton azul debajo del titulo de la seccion "Subir Archivo".`,
      },
      {
        contentType: "PlainText",
        content: `3) Ingresa los datos solicitados, el nombre del archvio, selecciona que tipo de archivo vas a subir y por ultimo busca el archivo correspondiente al tipo en tu dispositivo.`,
      },
      {
        contentType: "PlainText",
        content: `4) Presiona el boton "Subir".`,
      },
      {
        contentType: "PlainText",
        content: `Asi de sencillo puedes subir un archivo ${nombre} :).`,
      },
      {
        contentType: "PlainText",
        content: `Para ACCEDER A UN ARCHIVO debes seguir estos pasos:`,
      },
      {
        contentType: "PlainText",
        content: `1) Busca la seccion donde subiste el archivo e ingresa. \n2) Busca el archivo manualmente o ingresa el nombre en el buscador. \n3) Presiona el icono del archivo para ver su contenido.`,
      },
    ]
  }
  else if (intention == "Creadores") {
    response.messages = [
      {
        contentType: "PlainText",
        content: `FileAssiste es un proyecto creado para el curso de Seminario de Sistemas 1 por el Grupo 6 integrado por:`,
      },
      {
        contentType: "PlainText",
        content: `Luis Antonio Castillo Javier | 202003745 \nMoises David Maldonado de Leon | 202010833 \nWalter Javier Santizo Mazariegos | 202111718 \nBrian Estuardo Ajuchan Tococh | 202001086 \nTobias Francisco Zamora Santos | 202002873`,
      },
    ]
  }
  else if (intention == "Herramientas") {
    response.messages = [
      {
        contentType: "PlainText",
        content: `FileAssiste te puede apoyar con algunas herramientas ${nombre}, en el sidebar del lado izquierdo las puedes encontrar en el apartado de "Herramientas".\n Pudes encontar algunas como:\n\n *Traduccion de texto: para traduccion de contenido que sea de tu utiliad.\n\n *Asistente virtual - Yo :) : para poder apoyarte con dudas de la aplicacion.`,
      },
    ]
  }
  else if (intention == "Traduccion") {
    response.messages = [
      {
        contentType: "PlainText",
        content: `Para poder traduccir un texto usando la Herramienta de Traduccion debes seguir estos pasos:\n\n 1) Selecciona "Traducir Texto" en el sidebar de la izquierda en el apartado de "HERRAMIENTAS".\n\n 2) Selecciona el idioma original del texto que vas a ingresar.\n\n 3) Ingresa el texto que deseas traducir.\n\n 4) Selecciona el idioma al que deseas traducir el texto ingresado.\n\n 5) Oprime el boton azul "Traducir" para completar la traduccion, si todo salio bien se te mostrara la traduccion en el recuadro celeste "Resultado" debajo del boton.`,
      },
    ]
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