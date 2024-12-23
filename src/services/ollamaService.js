// Importamos 'axios', una librería que nos ayuda a hacer solicitudes HTTP, como enviar datos a un servidor y recibir respuestas.
const axios = require('axios');

// Esta es la función que se encarga de generar una respuesta de la API de Ollama, usando un "prompt" (mensaje o pregunta).
const generateResponse = async (prompt) => {
  try {
    // Mostramos en la consola el 'prompt' que se enviará a Ollama y la URL de la API de Ollama.
    console.log('Sending request to Ollama with prompt:', prompt);
    console.log('Ollama API URL:', process.env.OLLAMA_API_URL);
    
    // Usamos 'axios' para enviar una solicitud POST a la API de Ollama.
    // Enviamos el 'prompt' que recibimos como parámetro, y le indicamos que use el modelo 'llama2' de Ollama.
    const response = await axios.post(process.env.OLLAMA_API_URL, {
      model: 'llama2',  // Modelo de inteligencia artificial que usaremos
      prompt: prompt,   // El mensaje que se envía a la API
      stream: true      // Indicamos que queremos recibir la respuesta en "stream" (en partes mientras se genera)
    }, {
      responseType: 'stream' // Indicamos que esperamos una respuesta en formato de "stream" (datos en tiempo real)
    });

    // Variable para almacenar la respuesta completa de Ollama a medida que la recibimos.
    let fullResponse = '';

    // Promesa que maneja el flujo de datos que recibimos de Ollama.
    return new Promise((resolve, reject) => {
      // Escuchamos los datos que llegan de Ollama (en "chunks" o trozos).
      response.data.on('data', (chunk) => {
        // Convertimos cada trozo de datos a texto y lo dividimos en líneas, eliminando las vacías.
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        // Procesamos cada línea que recibimos.
        for (const line of lines) {
          // Convertimos cada línea de texto a un objeto JSON.
          const json = JSON.parse(line);
          
          // Si la línea contiene una respuesta, la añadimos a 'fullResponse'.
          if (json.response) {
            fullResponse += json.response;
            console.log('Partial response:', json.response); // Mostramos la respuesta parcial en la consola.
          }
        }
      });

      // Cuando se termine de recibir todos los datos, mostramos la respuesta completa y la resolvemos.
      response.data.on('end', () => {
        console.log('Full response:', fullResponse);
        resolve(fullResponse); // Resolvemos la promesa con la respuesta completa.
      });

      // Si ocurre un error mientras recibimos los datos, lo mostramos y rechazamos la promesa.
      response.data.on('error', (error) => {
        console.error('Error in Ollama stream:', error);
        reject(error); // Rechazamos la promesa con el error.
      });
    });

  } catch (error) {
    // Si ocurre un error en cualquier parte del proceso, lo mostramos en la consola.
    console.error('Error generating response from Ollama:', error.message);

    // Si hubo una respuesta de error de Ollama, la mostramos en la consola.
    if (error.response) {
      console.error('Ollama error response:', error.response.data);
      console.error('Ollama error status:', error.response.status);
    } else if (error.request) {
      // Si no recibimos respuesta de Ollama, lo indicamos.
      console.error('No response received from Ollama');
    }

    // Lanzamos un nuevo error para que el proceso que llamó a esta función sepa que algo falló.
    throw new Error(`Failed to generate response from Ollama: ${error.message}`);
  }
};

// Exportamos la función 'generateResponse' para que pueda ser usada en otros archivos.
module.exports = { generateResponse };
