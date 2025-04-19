const client = new LexRuntimeV2Client({});
export const handler = async (event) => {

    // return {statusCode: 200, body: JSON.stringify({respuesta: process.env.BOT_LENGUAJE}) } 

    let body;

    try {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Body inválido o malformado.' }),
        };
    }

    const { text, sessionId } = body;

    if (!text || !sessionId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Faltan "text" y/o "sessionId".' }),
        };
    }

    const params = {
        botId: process.env.BOT_ID,
        botAliasId: process.env.ALIAS_ID,
        localeId: process.env.BOT_LENGUAJE,
        sessionId: sessionId,
        text: text
    };

    try {
        const command = new RecognizeTextCommand(params);
        const lexResponse = await client.send(command);
        const message = lexResponse.messages?.[0]?.content || "El bot no respondió.";

        return {
            statusCode: 200,
            body: JSON.stringify({
                sessionState: lexResponse.sessionState,
                messages: lexResponse.messages
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error("Error al llamar a Lex:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error al comunicarse con Lex." }),
        };
    }
};