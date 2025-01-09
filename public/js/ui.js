import { sleepDiary } from './sleepDiary.js';

export const ui = {
    init() {
        this.bindEvents();
        this.renderSleepHistory();
        this.loadScheduledTips();
        this.startNextTipCountdown();
        this.renderSleepStatistics();
        this.initDarkMode();
    },

    bindEvents() {
        const sleepForm = document.getElementById('sleep-form');
        sleepForm.addEventListener('submit', this.handleSleepFormSubmit.bind(this));
    },

    async handleSleepFormSubmit(event) {
        event.preventDefault();
        
        const sleepDate = document.getElementById('sleep-date').value;
        const sleepDuration = document.getElementById('sleep-duration').value;
        const sleepQuality = document.querySelector('input[name="sleep-quality"]:checked').value;

        const entry = {
            date: sleepDate,
            duration: parseFloat(sleepDuration),
            quality: parseInt(sleepQuality)
        };

        await sleepDiary.addEntry(entry);
        await this.showPersonalizedTips(entry);
        this.renderSleepHistory();
        this.renderSleepStatistics();
        this.clearForm();
    },

    async showPersonalizedTips(entry) {
        const consejosContainer = document.getElementById('consejos-content');
        consejosContainer.innerHTML = '<p>Generando consejos personalizados...</p>';

        try {
            const tips = await sleepDiary.generatePersonalizedTips(entry);
            consejosContainer.innerHTML = '';

            tips.forEach(tip => {
                const tipElement = document.createElement('p');
                tipElement.textContent = tip;
                consejosContainer.appendChild(tipElement);
            });
        } catch (error) {
            console.error('Error al mostrar consejos personalizados:', error);
            consejosContainer.innerHTML = '<p>Error al generar consejos. Por favor, intenta nuevamente.</p>';
        }
    },

    renderSleepHistory() {
        const historyBody = document.getElementById('historial-body');
        historyBody.innerHTML = '';

        if (sleepDiary.sleepEntries.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3">No hay entradas de sueño registradas.</td>';
            historyBody.appendChild(row);
        } else {
            sleepDiary.sleepEntries.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${entry.duration} horas</td>
                    <td>${entry.quality}/5</td>
                `;
                historyBody.appendChild(row);
            });
        }
    },

    clearForm() {
        document.getElementById('sleep-form').reset();
    },

    loadScheduledTips() {
        const scheduledTips = [
            { time: 'morning', tip: 'Evita cafeína después de las 3 PM' },
            { time: 'morning', tip: 'Establece un horario de sueño consistente' },
            { time: 'afternoon', tip: 'Crea un ambiente oscuro y fresco para dormir' },
            { time: 'afternoon', tip: 'Practica técnicas de respiración antes de dormir' },
            { time: 'night', tip: 'No uses dispositivos electrónicos antes de dormir' },
            { time: 'night', tip: 'Evita cenas pesadas antes de acostarte' }
        ];

        const currentTime = new Date().getHours();
        const currentTipContainer = document.getElementById('lista-consejos-programados');
        currentTipContainer.innerHTML = '';

        let currentTimePeriod = '';
        if (currentTime >= 6 && currentTime < 12) {
            currentTimePeriod = 'morning';
        } else if (currentTime >= 12 && currentTime < 18) {
            currentTimePeriod = 'afternoon';
        } else {
            currentTimePeriod = 'night';
        }

        scheduledTips
            .filter(tip => tip.time === currentTimePeriod)
            .forEach(tip => {
                const tipElement = document.createElement('p');
                tipElement.textContent = tip.tip;
                currentTipContainer.appendChild(tipElement);
            });
    },

    startNextTipCountdown() {
        const counterElement = document.getElementById('contador-proximo-consejo');
        
        const updateCountdown = () => {
            const now = new Date();
            const nextTip = new Date();
            nextTip.setHours(22, 0, 0, 0);

            if (now > nextTip) {
                nextTip.setDate(nextTip.getDate() + 1);
            }

            const difference = nextTip - now;
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            counterElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    },

    renderSleepStatistics() {
        const stats = sleepDiary.calculateStatistics();
        const statsContainer = document.getElementById('estadisticas-content');
        
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

    initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const body = document.body;

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
        });

        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add('dark-mode');
        }
    }
};