// Creamos un objeto llamado 'chat' que contiene varios métodos para gestionar un chat.
export const chat = {
  // Inicializamos el chat llamando a otra función para configurar todo.
  init() {
    this.initializeChat();
  },

  // Preparamos todo para que el chat funcione correctamente.
  initializeChat() {
    // Obtenemos el formulario de chat y el campo donde el usuario escribe.
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    // Añadimos un 'evento' al formulario para escuchar cuando el usuario presione Enter o haga clic en "Enviar".
    chatForm.addEventListener('submit', async (event) => {
      // Evitamos que la página se recargue cuando se envíe el formulario.
      event.preventDefault();
      // Obtenemos el mensaje que el usuario escribió, eliminando espacios extras.
      const message = chatInput.value.trim();

      // Si el mensaje no está vacío...
      if (message) {
        // Llamamos a otra función para mostrar el mensaje del usuario en la pantalla.
        this.addMessage(message, 'user-message');
        // Limpiamos el campo de texto donde el usuario escribió.
        chatInput.value = '';
        // Enviamos el mensaje del usuario a un servicio (Ollama) para obtener una respuesta.
        await this.generateOllamaResponse(message);
      }
    });
  },

  // Esta función se encarga de añadir un nuevo mensaje al chat (en la pantalla).
  addMessage(message, className) {
    // Obtenemos el área donde se muestran los mensajes del chat.
    const chatMessages = document.getElementById('chat-messages');
    // Creamos un nuevo 'div' (una caja) para el nuevo mensaje.
    const messageElement = document.createElement('div');
    // Añadimos las clases que se nos pasan al mensaje para darle estilo.
    className.split(' ').forEach(cls => messageElement.classList.add(cls));
    // Añadimos el texto del mensaje dentro de la caja.
    messageElement.textContent = message;
    // Colocamos el mensaje en la sección donde se muestran los mensajes.
    chatMessages.appendChild(messageElement);
    // Nos aseguramos de que la pantalla siempre se desplace hacia abajo para ver el último mensaje.
    chatMessages.scrollTop = chatMessages.scrollHeight;
  },

  // Esta función se encarga de generar una respuesta de Ollama.
  async generateOllamaResponse(userMessage) {
    // Añadimos un mensaje que dice "Generando respuesta..." mientras esperamos la respuesta de Ollama.
    this.addMessage('Generando respuesta...', 'ai-message loading-message');
    try {
      // Imprimimos un mensaje en la consola para saber que estamos enviando la solicitud a Ollama.
      console.log('Sending request to Ollama');
      // Enviamos una solicitud al servidor para pedirle a Ollama que genere una respuesta basada en el mensaje del usuario.
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Decimos que el cuerpo de la solicitud es en formato JSON.
        },
        body: JSON.stringify({ prompt: userMessage }), // Enviamos el mensaje del usuario a Ollama.
      });

      console.log('Received response from Ollama');
      // Convertimos la respuesta de Ollama en un objeto de JavaScript.
      const data = await response.json();
      // Imprimimos la respuesta de Ollama en la consola para depuración.
      console.log('Ollama response data:', data);

      // Eliminamos el mensaje de "Generando respuesta..." cuando ya tenemos una respuesta.
      const loadingMessage = document.querySelector('.loading-message');
      if (loadingMessage) {
        loadingMessage.remove();
      }

      // Si la respuesta de Ollama no es correcta, mostramos un error.
      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status}. ${data.error || ''}`);
      }

      // Si Ollama nos devuelve una respuesta válida, la mostramos en el chat.
      if (data && data.response) {
        this.addMessage(data.response, 'ai-message');
      } else {
        // Si la respuesta está vacía, mostramos un error.
        throw new Error('Respuesta vacía del servidor');
      }
    } catch (error) {
      // Si hubo algún error al generar la respuesta de Ollama, lo mostramos en la consola.
      console.error('Error al generar respuesta de Ollama:', error);
      
      // Eliminamos el mensaje de "Generando respuesta..." en caso de error.
      const loadingMessage = document.querySelector('.loading-message');
      if (loadingMessage) {
        loadingMessage.remove();
      }

      // Mostramos un mensaje de error en el chat para el usuario.
      this.addMessage(`Error: ${error.message}. Por favor, intenta de nuevo más tarde.`, 'ai-message error');
    }
  },
};

  
  
  
  