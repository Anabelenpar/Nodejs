// Importamos las librerías necesarias para manejar tokens (jsonwebtoken) y encriptación de contraseñas (bcryptjs).
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models'); // Importamos el modelo de Usuario para poder interactuar con la base de datos.


// Esta función maneja el proceso de inicio de sesión (login) de un usuario.
const handleLogin = async (req, res) => {
  try {
    // Extraemos el nombre de usuario y la contraseña que el usuario envió en la solicitud (req.body).
    const { username, password } = JSON.parse(req.body);

    // Imprimimos en la consola un mensaje con el nombre de usuario que está intentando iniciar sesión.
    console.log('Login attempt:', { username });

    // Buscamos en la base de datos si existe un usuario con ese nombre de usuario.
    const user = await User.findOne({ where: { username } });

    // Si encontramos al usuario y la contraseña enviada coincide con la contraseña almacenada (comprobada con bcrypt):
    if (user && await bcrypt.compare(password, user.password)) {
      // Si la autenticación es exitosa, creamos un "token" (un tipo de llave de acceso temporal) y un "refresh token".
      // El "token" tiene un tiempo de expiración de 15 minutos.
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

      // El "refresh token" dura 7 días y se utiliza para obtener un nuevo "token" cuando expire.
      const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      // Imprimimos en la consola que el inicio de sesión fue exitoso.
      console.log('Login successful:', { username, userId: user.id });

      // Respondemos al cliente con los tokens generados y el ID del usuario.
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token, refreshToken, userId: user.id }));
    } else {
      // Si el usuario no existe o la contraseña no coincide, informamos al cliente que las credenciales son incorrectas.
      console.log('Login failed:', { username });

      // Enviamos un código de error 401 (no autorizado) al cliente.
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid credentials' }));
    }
  } catch (error) {
    // Si ocurre un error en el proceso de inicio de sesión, lo mostramos en la consola y enviamos un mensaje de error al cliente.
    console.error('Login error:', error);

    // Respondemos con un código de error 500 (error interno del servidor) si hubo algún problema en el servidor.
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error', error: error.message }));
  }
};

// Exportamos la función "handleLogin" para que pueda ser utilizada en otras partes de la aplicación.
module.exports = { handleLogin };






