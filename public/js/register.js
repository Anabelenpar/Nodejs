document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            errorMessage.textContent = 'Las contraseñas no coinciden';
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registro exitoso:', data);
                window.location.href = 'login.html';
            } else {
                console.error('Error en el registro:', data.message);
                errorMessage.textContent = data.message || 'Error en el registro';
            }
        } catch (error) {
            console.error('Error durante el registro:', error);
            errorMessage.textContent = 'Error en el registro';
        }
    });
});