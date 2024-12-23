// Requerimos módulos necesarios para nuestro servidor y base de datos
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { sequelize, User, SleepEntry } = require('./models');
const { handleGetUsers, handleCreateUser } = require('./routes/users');
const { handleLogin } = require('./routes/login');
const { handleGetSleepData, handlePostSleepData } = require('./routes/data');
const { verifyToken } = require('./middleware/auth');
const { handleOllamaRequest } = require('./routes/ollama');
const jwt = require('jsonwebtoken');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Función para inicializar la base de datos y probar la conexión
const initDatabase = async () => {
  try {
    // Intentamos conectar a la base de datos
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sincronizamos la base de datos (creamos o actualizamos las tablas necesarias)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Intentamos crear un usuario de prueba si no existe
    const [testUser, created] = await User.findOrCreate({
      where: { username: 'testuser' },
      defaults: {
        password: await bcrypt.hash('password123', 10) // Encriptamos la contraseña antes de guardarla
      }
    });

    if (created) {
      console.log('Test user created:', testUser.toJSON());
    } else {
      console.log('Test user already exists');
    }
  } catch (error) {
    // Si no podemos conectar a la base de datos, mostramos un error y detenemos el programa
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Llamamos a la función para inicializar la base de datos
initDatabase();

// Configuración de CORS (control de qué sitios pueden acceder a nuestro servidor)
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

// Función para manejar la solicitud de refresco de token (cuando el token de acceso ha expirado)
const handleRefreshToken = async (req, res) => {
  const { refreshToken } = JSON.parse(req.body); // Obtenemos el refresh token de la solicitud
  if (!refreshToken) {
    // Si no hay refresh token, respondemos con un error
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Refresh token is required' }));
  }

  try {
    // Verificamos el refresh token y decodificamos la información del usuario
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded.id); // Buscamos al usuario en la base de datos

    if (!user) {
      // Si no encontramos al usuario, respondemos con un error
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'User not found' }));
    }

    // Si todo está bien, generamos un nuevo token de acceso y refresh token
    const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Enviamos los nuevos tokens al cliente
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token: newToken, refreshToken: newRefreshToken }));
  } catch (error) {
    // Si hay un error al verificar el refresh token, respondemos con un error
    console.error('Error refreshing token:', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid refresh token' }));
  }
};

// Función para verificar si un token es válido
const handleVerifyToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraemos el token de la cabecera

  if (!token) {
    // Si no hay token, respondemos con un error
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'No token provided' }));
  }

  try {
    // Verificamos si el token es válido
    jwt.verify(token, process.env.JWT_SECRET);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Token is valid' }));
  } catch (error) {
    // Si el token no es válido, respondemos con un error
    console.error('Token verification error:', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid token' }));
  }
};

// Creamos el servidor que manejará las solicitudes HTTP
const server = http.createServer((req, res) => {
  console.log('Received request:', req.method, req.url); // Mostramos en consola la solicitud recibida

  const url = new URL(req.url, `http://${req.headers.host}`); // Creamos un objeto URL a partir de la solicitud
  const pathname = url.pathname; // Obtenemos el camino (path) de la URL

  // Configuramos CORS para permitir solicitudes desde localhost:3000
  cors(corsOptions)(req, res, () => {
    // Si la solicitud es para un archivo estático (js, css, html), lo enviamos como respuesta
    if (pathname.startsWith('/js/') || pathname.startsWith('/css/') || pathname === '/index.html' || pathname === '/login.html' || pathname === '/') {
      const filePath = path.join(__dirname, '..', 'public', pathname === '/' ? 'index.html' : pathname); // Construimos la ruta del archivo solicitado
      fs.readFile(filePath, (err, content) => { // Leemos el archivo
        if (err) {
          // Si hay un error leyendo el archivo, respondemos con un error 404
          console.error('Error reading file:', filePath, err);
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404 Not Found');
        } else {
          const ext = path.extname(filePath); // Obtenemos la extensión del archivo
          let contentType = 'text/html'; // Establecemos el tipo de contenido predeterminado

          // Establecemos el tipo de contenido según la extensión del archivo
          if (ext === '.js') contentType = 'text/javascript';
          if (ext === '.css') contentType = 'text/css';
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content); // Enviamos el archivo al cliente
        }
      });
      return;
    }

    // Si la solicitud es para la API
    if (pathname.startsWith('/api/')) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // Acumulamos los datos recibidos en el cuerpo de la solicitud
      });

      req.on('end', () => {
        req.body = body;
        console.log('Request body:', body); // Mostramos en consola el cuerpo de la solicitud

        // Verificamos la ruta y el método HTTP para decidir qué hacer
        switch (pathname) {
          case '/api/users':
            if (req.method === 'GET') {
              verifyToken(req, res, () => handleGetUsers(req, res)); // Verificamos el token antes de obtener los usuarios
            } else if (req.method === 'POST') {
              handleCreateUser(req, res); // Creamos un nuevo usuario
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/login':
            if (req.method === 'POST') {
              handleLogin(req, res); // Manejamos el inicio de sesión
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/data':
            if (req.method === 'GET') {
              verifyToken(req, res, () => handleGetSleepData(req, res)); // Obtenemos los datos del sueño
            } else if (req.method === 'POST') {
              verifyToken(req, res, () => handlePostSleepData(req, res)); // Enviamos los datos del sueño
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/ollama':
            if (req.method === 'POST') {
              handleOllamaRequest(req, res); // Manejamos la solicitud de Ollama
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/refresh-token':
            if (req.method === 'POST') {
              handleRefreshToken(req, res); // Refrescamos el token de acceso
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/verify-token':
            if (req.method === 'GET') {
              handleVerifyToken(req, res); // Verificamos si el token es válido
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          default:
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
      });
    } else {
      // Si la ruta no es válida, respondemos con un error 404
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    }
  });
});

// Iniciamos el servidor en el puerto especificado o 3000 por defecto
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
server.listen(port, host, () => console.log(`Server listening on http://${host}:${port}`));




