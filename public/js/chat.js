export const chat = {
  init() {
    this.initializeChat();
  },

  initializeChat() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    chatForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const message = chatInput.value.trim();

      if (message) {
        this.addMessage(message, 'user-message');
        chatInput.value = '';
        await this.generateOllamaResponse(message);
      }
    });
  },

  addMessage(message, className) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    className.split(' ').forEach(cls => messageElement.classList.add(cls));
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  },

  async generateOllamaResponse(userMessage) {
    this.addMessage('Generando respuesta...', 'ai-message loading-message');
    try {
      console.log('Sending request to Ollama');
      const response = await fetch('/api/ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      console.log('Received response from Ollama');
      const data = await response.json();
      console.log('Ollama response data:', data);

      // Eliminar el mensaje de carga
      const loadingMessage = document.querySelector('.loading-message');
      if (loadingMessage) {
        loadingMessage.remove();
      }

      if (!response.ok) {
        throw new Error(`Error en la respuesta del servidor: ${response.status}. ${data.error || ''}`);
      }

      if (data && data.response) {
        this.addMessage(data.response, 'ai-message');
      } else {
        throw new Error('Respuesta vacía del servidor');
      }
    } catch (error) {
      console.error('Error al generar respuesta de Ollama:', error);
      
      // Eliminar el mensaje de carga
      const loadingMessage = document.querySelector('.loading-message');
      if (loadingMessage) {
        loadingMessage.remove();
      }

      this.addMessage(`Error: ${error.message}. Por favor, intenta de nuevo más tarde.`, 'ai-message error');
    }
  },
};

  
  
  
  