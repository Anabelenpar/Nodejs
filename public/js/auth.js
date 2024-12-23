export const auth = {
    // Intentamos obtener un nuevo "token" usando un "refreshToken".
    async refreshToken() {
      try {
        // Hace una petición al servidor para obtener un nuevo token, enviando el refreshToken actual.
        const response = await fetch('/api/refresh-token', {
          method: 'POST', // Estamos enviando información al servidor.
          headers: {
            'Content-Type': 'application/json', // Le decimos al servidor que estamos enviando datos en formato JSON.
          },
          body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }), // Enviamos el refreshToken que está guardado en el navegador.
        });
  
        // Si la respuesta del servidor no es positiva, lanzamos un error.
        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
        
        // Si todo va bien, convertimos la respuesta del servidor a formato JSON y guardamos el nuevo token.
        const data = await response.json();
        localStorage.setItem('token', data.token); // Guardamos el nuevo token de acceso.
        localStorage.setItem('refreshToken', data.refreshToken); // Guardamos también el nuevo refreshToken.
        return data.token; // Devolvemos el nuevo token para que sea usado.
      } catch (error) {
        // Si algo sale mal (por ejemplo, el servidor no responde o no se puede obtener el nuevo token).
        console.error('Error refreshing token:', error); // Mostramos el error en la consola.
        localStorage.removeItem('token'); // Eliminamos el token viejo.
        localStorage.removeItem('refreshToken'); // También eliminamos el refreshToken viejo.
        window.location.href = '/login.html'; // Redirigimos al usuario a la página de inicio de sesión.
      }
    },
  
    // Esta función verifica si el token actual sigue siendo válido.
    async getValidToken() {
    // Intentamos obtener el token de acceso que está guardado en el navegador.
      let token = localStorage.getItem('token');
      // Si no encontramos el token, significa que no estamos autenticados, por lo que lanzamos un error.
      if (!token) {
        throw new Error('No token found');
      }
  
      try {
        // Hacemos una petición al servidor para verificar si el token es válido.
        const response = await fetch('/api/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}` // Enviamos el token actual como parte de la petición para que el servidor lo verifique.
          }
        });
  
        // Si la respuesta no es positiva (por ejemplo, el token ya ha expirado o es inválido).
        if (!response.ok) {
        // Si el error es porque el token es inválido (código de error 401), intentamos obtener un nuevo token.
          if (response.status === 401) {
            token = await this.refreshToken(); // Llamamos a la función para obtener un nuevo token.
          } else {
            throw new Error('Failed to verify token'); // Si hay otro error, lanzamos un mensaje de error.
          }
        }
  
        // Si todo está bien, devolvemos el token válido.
        return token;
      } catch (error) {
        // Si hay un error (por ejemplo, si el servidor no responde o hay algún problema con la verificación).
        console.error('Error getting valid token:', error);
        throw error;
      }
    }
  };
  