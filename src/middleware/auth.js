// Importa el módulo jsonwebtoken para manejar los tokens de autenticación.
const jwt = require('jsonwebtoken');

// Define una función llamada verifyToken para verificar que el usuario tenga un token válido.
const verifyToken = (req, res, next) => {
  // Obtiene el encabezado de autorización (Authorization) de la solicitud HTTP.
  const authHeader = req.headers['authorization'];
  // Extrae el token del encabezado, que debe estar en formato "Bearer <token>".
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, responde con un error 401 (no autorizado) y un mensaje JSON.
  if (!token) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'No token provided' }));
  }

  try {
    // Intenta verificar el token usando la clave secreta del servidor.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Si la verificación es exitosa, guarda el ID del usuario en la solicitud.
    req.userId = decoded.id;
    // Continúa con la siguiente función en la cadena (si la verificación es exitosa).
    next();
  } catch (error) {
    // Si ocurre un error al verificar el token, muestra el error en la consola.
    console.error('Token verification error:', error);
    // Responde con un error 401 (no autorizado) y un mensaje JSON que explica el error.
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Invalid token', error: error.message }));
  }
};

// Exporta la función verifyToken para que se pueda usar en otras partes del código.
module.exports = { verifyToken };

