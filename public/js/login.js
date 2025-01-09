document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  const getBaseUrl = () => window.location.origin;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${getBaseUrl()}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('userId', data.userId);
        window.location.href = 'index.html';
      } else {
        console.error('Login failed:', data.message);
        errorMessage.textContent = data.message || 'Credenciales inválidas';
      }
    } catch (error) {
      console.error('Error during login:', error);
      errorMessage.textContent = 'Error al iniciar sesión';
    }
  });
});

