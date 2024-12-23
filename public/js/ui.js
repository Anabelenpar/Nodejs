// Importa el objeto 'sleepDiary' de otro archivo para usarlo en este archivo
import { sleepDiary } from './sleepDiary.js';

export const ui = {
    // Método para inicializar la interfaz de usuario
    init() {
        this.bindEvents(); // Asocia los eventos, como el envío de formularios
        this.renderSleepHistory(); // Muestra el historial de sueño
        this.loadScheduledTips(); // Carga consejos programados según la hora del día
        this.startNextTipCountdown(); // Inicia una cuenta atrás para el próximo consejo
        this.renderSleepStatistics(); // Muestra las estadísticas del sueño
        this.initDarkMode(); // Configura el modo oscuro
    },

    // Método para asociar eventos, como el envío del formulario
    bindEvents() {
        const sleepForm = document.getElementById('sleep-form'); // Obtiene el formulario de sueño por su id
        sleepForm.addEventListener('submit', this.handleSleepFormSubmit.bind(this)); // Asocia la acción de enviar el formulario
    },

    // Método para manejar el envío del formulario de sueño
    handleSleepFormSubmit(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
        
        // Obtiene los valores del formulario
        const sleepDate = document.getElementById('sleep-date').value;
        const sleepDuration = document.getElementById('sleep-duration').value;
        const sleepQuality = document.querySelector('input[name="sleep-quality"]:checked').value;

        // Crea una entrada de sueño con los datos obtenidos
        const entry = {
            date: sleepDate,
            duration: parseFloat(sleepDuration), // Convierte la duración a número flotante
            quality: parseInt(sleepQuality) // Convierte la calidad a número entero
        };

        // Añade la nueva entrada al diario de sueño
        sleepDiary.addEntry(entry);
        
        // Muestra consejos personalizados para mejorar el sueño
        this.showPersonalizedTips(entry);
        
        // Actualiza la interfaz para mostrar el historial de sueño y las estadísticas
        this.renderSleepHistory();
        this.renderSleepStatistics();
        
        // Limpia el formulario
        this.clearForm();
    },

    // Muestra consejos personalizados basados en la entrada de sueño
    async showPersonalizedTips(entry) {
        const consejosContainer = document.getElementById('consejos-content');
        consejosContainer.innerHTML = '<p>Generando consejos personalizados...</p>';

        try {
            // Llama a la función que genera consejos y espera la respuesta
            const tips = await sleepDiary.generatePersonalizedTips(entry);
            consejosContainer.innerHTML = ''; // Limpia el contenedor

            // Muestra los consejos generados en la interfaz
            tips.forEach(tip => {
                const tipElement = document.createElement('p');
                tipElement.textContent = tip;
                consejosContainer.appendChild(tipElement);
            });
        } catch (error) {
            console.error('Error al mostrar consejos personalizados:', error);
            // Muestra un mensaje de error si falla la generación de consejos
            consejosContainer.innerHTML = '<p>Error al generar consejos. Por favor, intenta nuevamente.</p>';
        }
    },

    // Muestra el historial de las entradas de sueño
    renderSleepHistory() {
        const historyBody = document.getElementById('historial-body');
        historyBody.innerHTML = ''; // Limpia el historial mostrado

        // Itera sobre las entradas de sueño y las muestra en la tabla
        sleepDiary.sleepEntries.forEach(entry => {
            const row = document.createElement('tr'); // Crea una fila de la tabla
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.duration} horas</td>
                <td>${entry.quality}/5</td>
            `;
            historyBody.appendChild(row); // Añade la fila a la tabla
        });
    },

    // Limpia el formulario de entrada de sueño
    clearForm() {
        document.getElementById('sleep-form').reset();
    },

    // Carga los consejos programados según la hora del día (mañana, tarde, noche)
    loadScheduledTips() {
        const scheduledTips = [
            { time: 'morning', tip: 'Evita cafeína después de las 3 PM' },
            { time: 'morning', tip: 'Establece un horario de sueño consistente' },
            { time: 'afternoon', tip: 'Crea un ambiente oscuro y fresco para dormir' },
            { time: 'afternoon', tip: 'Practica técnicas de respiración antes de dormir' },
            { time: 'night', tip: 'No uses dispositivos electrónicos antes de dormir' },
            { time: 'night', tip: 'Evita cenas pesadas antes de acostarte' }
        ];

        const currentTime = new Date().getHours(); // Obtiene la hora actual
        const currentTipContainer = document.getElementById('lista-consejos-programados');
        currentTipContainer.innerHTML = ''; // Limpia los consejos mostrados

        // Determina la franja horaria actual
        let currentTimePeriod = '';
        if (currentTime >= 6 && currentTime < 12) {
            currentTimePeriod = 'morning'; // Mañana
        } else if (currentTime >= 12 && currentTime < 18) {
            currentTimePeriod = 'afternoon'; // Tarde
        } else {
            currentTimePeriod = 'night'; // Noche
        }

        // Filtra y muestra solo los consejos de la franja horaria actual
        scheduledTips
            .filter(tip => tip.time === currentTimePeriod)
            .forEach(tip => {
                const tipElement = document.createElement('p');
                tipElement.textContent = tip.tip;
                currentTipContainer.appendChild(tipElement);
            });
    },

    // Inicia una cuenta atrás para el próximo consejo programado
    startNextTipCountdown() {
        const counterElement = document.getElementById('contador-proximo-consejo');
        
        const updateCountdown = () => {
            const now = new Date();
            const nextTip = new Date();
            nextTip.setHours(22, 0, 0, 0); // Establece la hora del próximo consejo (22:00)

            if (now > nextTip) {
                nextTip.setDate(nextTip.getDate() + 1); // Si ya pasó el consejo, configura el próximo día
            }

            // Calcula la diferencia en horas, minutos y segundos
            const difference = nextTip - now;
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            // Muestra la cuenta atrás en formato hh:mm:ss
            counterElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        updateCountdown(); // Llama la primera vez para mostrar la cuenta atrás
        setInterval(updateCountdown, 1000); // Actualiza cada segundo
    },

    // Muestra las estadísticas de sueño (promedio, calidad, etc.)
    renderSleepStatistics() {
        const stats = sleepDiary.calculateStatistics(); // Calcula las estadísticas
        const statsContainer = document.getElementById('estadisticas-content');
        
        // Si hay estadísticas, las muestra; si no, muestra un mensaje indicando que no hay datos suficientes
        if (stats) {
            statsContainer.innerHTML = `
                <p>Duración promedio: ${stats.avgDuration} horas</p>
                <p>Calidad promedio: ${stats.avgQuality}/5</p>
                <p>Total de entradas: ${stats.totalEntries}</p>
                <p>Promedio semanal: ${stats.weeklyAvgDuration} horas</p>
            `;
        } else {
            statsContainer.innerHTML = '<p>No hay suficientes datos para mostrar estadísticas.</p>';
        }
    },

    // Configura el modo oscuro, permitiendo al usuario alternar entre el modo claro y oscuro
    initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const body = document.body;

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode'); // Alterna la clase 'dark-mode'
            localStorage.setItem('darkMode', body.classList.contains('dark-mode')); // Guarda la preferencia en el almacenamiento local
        });

        // Si el usuario tiene la preferencia de modo oscuro, aplica el modo oscuro al cargar la página
        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add('dark-mode');
        }
    }
};
