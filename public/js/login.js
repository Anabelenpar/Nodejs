// Escucha cuando la página web haya cargado completamente.
document.addEventListener('DOMContentLoaded', () => {
    // Obtiene el formulario de inicio de sesión y el mensaje de error.
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
  
    // Añade un evento para cuando el formulario se envíe (se haga clic en el botón de "iniciar sesión").
    loginForm.addEventListener('submit', async (e) => {
      // Prevenimos que el formulario se envíe de forma normal (y recargue la página).
      e.preventDefault();
      // Obtiene los valores que el usuario ha escrito en los campos de nombre de usuario y contraseña.
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      try {
        // Envia una solicitud al servidor para verificar el nombre de usuario y la contraseña.
        const response = await fetch('/api/login', {
        // Envía los datos del usuario y contraseña en formato JSON.
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        // Convierte la respuesta del servidor en un objeto JavaScript.
        const data = await response.json();
  
        // Si la respuesta del servidor es exitosa.
        if (response.ok) {
          console.log('Login successful:', data);
          // Guarda algunos datos importantes (como un token de seguridad) en el almacenamiento local del navegador.
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('userId', data.userId);
          // Redirige al usuario a la página principal
          window.location.href = 'index.html';
        } else {
        // Si no fue exitoso, muestra el mensaje de error del servidor.
          console.error('Login failed:', data.message);
          errorMessage.textContent = data.message || 'Credenciales inválidas'; // Muestra un mensaje de error al usuario.
        }
      } catch (error) {
        // Si ocurrió algún error durante el proceso (por ejemplo, si no hay conexión a internet).
        console.error('Error during login:', error);
        errorMessage.textContent = 'Error al iniciar sesión'; // Muestra un mensaje genérico de error.
      }
    });
  });
