//Importamos módulos necesarios para la aplicación que son parte del programa.
import { sleepDiary } from './sleepDiary.js'; // Maneja las funciones del diario de sueño.
import { ui } from './ui.js'; // Controla la interfaz de usuario.
import { chat } from './chat.js'; // Permite funcionalidades de chat.

// Esperamos a que toda la página cargue completamente antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', async () => {
    // Obtenemos el token y el ID del usuario guardados en el navegador.
    // Esto se utiliza para verificar que el usuario haya iniciado sesión.
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    // Si no hay token o ID de usuario, redirigimos al usuario a la página de inicio de sesión.
    if (!token || !userId) {
        window.location.href = 'login.html'; // Cambia la página actual a la de inicio de sesión.
        return; // Detiene la ejecución del resto del código.
    }

    // Inicia el módulo del diario de sueño con el token del usuario.
    try {
        console.log('Initializing sleepDiary...'); // Mensaje para saber qué está haciendo el programa.
        await sleepDiary.init(token);
        // Inicia el módulo de la interfaz de usuario.
        console.log('Initializing UI...');
        ui.init();
        // Inicia el módulo de chat.
        console.log('Initializing chat...');
        chat.init();
        // Si todos los módulos se inician correctamente, mostramos este mensaje en la consola.
        console.log('All modules initialized successfully.');

        // Muestra información del usuario en la página.
        const userInfo = document.getElementById('user-info'); // Seleccionamos el área donde aparecerá la información.
        userInfo.textContent = `Usuario conectado: ID ${userId}`; // Escribimos el ID del usuario conectado.

        // Hacemos visible el botón de cierre de sesión y lo configuramos.
        const logoutButton = document.getElementById('logout-button'); // Seleccionamos el botón.
        logoutButton.style.display = 'block'; // Hacemos que el botón aparezca en la página.
        // Añadimos una acción al botón: cuando se haga clic, cerrará la sesión.
        logoutButton.addEventListener('click', () => {
            // Eliminamos el token y el ID del usuario del navegador para cerrar sesión.
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            // Redirigimos al usuario de vuelta a la página de inicio de sesión.
            window.location.href = 'login.html';
        });
    } catch (error) {
        // Si algo falla al inicializar la aplicación, mostramos un mensaje de error en la consola.
        console.error('Error initializing application:', error);
    }
});
