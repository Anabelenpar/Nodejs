// Importamos una función llamada "generateResponse" desde otro archivo llamado 'ollamaService'.
// Esta función es la que se encarga de generar una respuesta a partir de un "prompt" (entrada o mensaje).
const { generateResponse } = require('../services/ollamaService');

// Esta es la función que maneja la solicitud (request) cuando el cliente hace una petición relacionada con Ollama.
const handleOllamaRequest = async (req, res) => {
  try {
    // Mostramos en la consola que hemos recibido una solicitud de Ollama.
    console.log('Received Ollama request');

    // Extraemos el "prompt" (mensaje o entrada) que se envió en la solicitud. Este "prompt" es lo que se le pasará a Ollama.
    const { prompt } = JSON.parse(req.body);
    
    // Mostramos en la consola el "prompt" que hemos recibido para verificar qué datos estamos manejando.
    console.log('Prompt:', prompt);
    
    // Llamamos a la función "generateResponse" con el "prompt" recibido y esperamos a que nos devuelva una respuesta.
    const response = await generateResponse(prompt);
    
    // Mostramos en la consola la respuesta que hemos recibido de Ollama.
    console.log('Ollama response:', response);
    
    // Si no obtenemos una respuesta (si la respuesta es vacía), lanzamos un error indicando que no se recibió ninguna respuesta.
    if (!response) {
      throw new Error('Respuesta vacía de Ollama');
    }
    
    // Si todo fue bien, respondemos al cliente con la respuesta obtenida de Ollama.
    // Enviamos un código de estado 200 (todo bien) y la respuesta en formato JSON.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ response }));
  } catch (error) {
    // Si ocurre un error durante el proceso, lo mostramos en la consola para poder rastrear qué salió mal.
    console.error('Error in Ollama request:', error.message);

    // Respondemos al cliente con un código de error 500 (error en el servidor), 
    // indicando que hubo un problema al procesar la solicitud.
    // También enviamos detalles del error, y si estamos en un entorno de desarrollo, mostramos el rastro completo del error.
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Error processing Ollama request', 
      error: error.message,
      // Solo mostramos el "stack" (detalles del error) si estamos en un entorno de desarrollo para poder depurar mejor.
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }));
  }
};

// Exportamos la función "handleOllamaRequest" para que pueda ser utilizada en otras partes de la aplicación.
module.exports = { handleOllamaRequest };
