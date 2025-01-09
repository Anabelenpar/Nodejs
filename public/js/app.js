import { sleepDiary } from './sleepDiary.js';
import { ui } from './ui.js';
import { chat } from './chat.js';

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    console.log('No authentication tokens found, redirecting to login...');
    window.location.href = 'login.html';
    return;
  }

  try {
    console.log('Initializing sleepDiary...');
    await sleepDiary.init();
    console.log('SleepDiary initialized successfully');
    
    console.log('Initializing UI...');
    ui.init();
    console.log('UI initialized successfully');
    
    console.log('Initializing chat...');
    chat.init();
    console.log('Chat initialized successfully');

    const userInfo = document.getElementById('user-info');
    userInfo.textContent = `Usuario conectado: ID ${userId}`;

    const logoutButton = document.getElementById('logout-button');
    logoutButton.style.display = 'block';
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      window.location.href = 'login.html';
    });
  } catch (error) {
    console.error('Error initializing application:', error);
    if (error.message.includes('token') || error.message.includes('auth')) {
      console.log('Authentication error detected, redirecting to login...');
      localStorage.clear();
      window.location.href = 'login.html';
    }
  }
});