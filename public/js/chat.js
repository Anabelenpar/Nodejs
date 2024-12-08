export const chat = {
    init() {
        this.initializeChat();
    },

    initializeChat() {
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const message = chatInput.value.trim();

            if (message) {
                this.addMessage(message, 'user-message');
                this.generateAIResponse(message);
                chatInput.value = '';
            }
        });
    },

    addMessage(message, className) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add(className);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        const responses = {
            'hola': [
                'Hola, soy tu Asistente de Sueño. ¿En qué puedo ayudarte hoy?',
                '¡Bienvenido! Estoy aquí para ayudarte a mejorar tu sueño. ¿Tienes alguna pregunta específica?'
            ],
            'dormir': [
                'Dormir bien es crucial para tu salud. ¿Tienes problemas para conciliar el sueño o mantenerte dormido?',
                'Un buen sueño es la base de una vida saludable. ¿Qué aspectos de tu sueño te gustaría mejorar?'
            ],
            'insomnio': [
                'El insomnio puede ser frustrante. Algunas estrategias útiles incluyen mantener un horario regular, crear un ambiente relajante y practicar técnicas de relajación. ¿Has probado alguna de estas?',
                'Combatir el insomnio requiere paciencia. Podemos trabajar en identificar las causas y desarrollar un plan personalizado. ¿Cuánto tiempo llevas experimentando insomnio?'
            ],
            'consejos': [
                'Algunos consejos generales para mejorar tu sueño incluyen: mantener un horario regular, crear un ambiente oscuro y fresco, evitar la cafeína y el alcohol antes de dormir, y practicar una rutina relajante antes de acostarte. ¿Cuál de estos te gustaría explorar más?',
                'Para mejorar tu sueño, considera limitar el uso de dispositivos electrónicos antes de dormir, hacer ejercicio regularmente (pero no justo antes de acostarte), y manejar el estrés con técnicas de relajación. ¿Alguno de estos consejos te llama la atención?'
            ],
            'gracias': [
                '¡De nada! Recuerda que mejorar tus hábitos de sueño es un proceso. Si tienes más preguntas en el futuro, no dudes en consultarme.',
                'Es un placer ayudarte. Recuerda que un buen sueño es clave para tu salud física y mental. ¿Hay algo más en lo que pueda ayudarte?'
            ]
        };

        let response = 'Entiendo que tienes una pregunta sobre el sueño. ¿Podrías ser más específico sobre qué aspecto te interesa o preocupa?';

        for (let [keyword, responseOptions] of Object.entries(responses)) {
            if (lowerMessage.includes(keyword)) {
                response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
                break;
            }
        }

        setTimeout(() => {
            this.addMessage(response, 'ai-message');
        }, 1000);
    }
};

