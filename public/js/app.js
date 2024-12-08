import { sleepDiary } from './sleepDiary.js';
import { ui } from './ui.js';
import { chat } from './chat.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
        window.location.href = 'login.html';
        return;
    }

    try {
        console.log('Initializing sleepDiary...');
        await sleepDiary.init(token);
        console.log('Initializing UI...');
        ui.init();
        console.log('Initializing chat...');
        chat.init();
        console.log('All modules initialized successfully.');

        // Mostrar información del usuario
        const userInfo = document.getElementById('user-info');
        userInfo.textContent = `Usuario conectado: ID ${userId}`;

        // Configurar el botón de cierre de sesión
        const logoutButton = document.getElementById('logout-button');
        logoutButton.style.display = 'block';
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = 'login.html';
        });
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});
