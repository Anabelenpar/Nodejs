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
const auth = require('./services/auth');

dotenv.config();

const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    const [testUser, created] = await User.findOrCreate({
      where: { username: 'testuser' },
      defaults: {
        password: await bcrypt.hash('password123', 10)
      }
    });
    if (created) {
      console.log('Test user created:', testUser.toJSON());
    } else {
      console.log('Test user already exists');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

initDatabase();

const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://0.0.0.0:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
  allowPrivateNetwork: true
};

const handleRefreshToken = async (req, res) => {
  const { refreshToken } = JSON.parse(req.body);
  if (!refreshToken) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Refresh token is required' }));
  }

  try {
    const { token, refreshToken: newRefreshToken } = await auth.refreshToken(refreshToken);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token, refreshToken: newRefreshToken }));
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid refresh token' }));
  }
};

const handleVerifyToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'No token provided' }));
  }

  try {
    const isValid = await auth.verifyToken(token);
    if (isValid) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Token is valid' }));
    } else {
      throw new Error('Invalid token');
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid token' }));
  }
};

const server = http.createServer((req, res) => {
  console.log('Received request:', req.method, req.url);

  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(','));
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Apply CORS to all routes
  cors(corsOptions)(req, res, () => {
    if (pathname.startsWith('/js/') || pathname.startsWith('/css/') || pathname === '/index.html' || pathname === '/login.html' || pathname === '/') {
      const filePath = path.join(__dirname, '..', 'public', pathname === '/' ? 'index.html' : pathname);
      fs.readFile(filePath, (err, content) => {
        if (err) {
          console.error('Error reading file:', filePath, err);
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('404 Not Found');
        } else {
          const ext = path.extname(filePath);
          let contentType = 'text/html';
          if (ext === '.js') contentType = 'text/javascript';
          if (ext === '.css') contentType = 'text/css';
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content);
        }
      });
      return;
    }

    if (pathname.startsWith('/api/')) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        req.body = body;
        console.log('Request body:', body);

        switch (pathname) {
          case '/api/users':
            if (req.method === 'GET') {
              verifyToken(req, res, () => handleGetUsers(req, res));
            } else if (req.method === 'POST') {
              handleCreateUser(req, res);
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/login':
            if (req.method === 'POST') {
              handleLogin(req, res);
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/data':
            if (req.method === 'GET') {
              verifyToken(req, res, () => handleGetSleepData(req, res));
            } else if (req.method === 'POST') {
              verifyToken(req, res, () => handlePostSleepData(req, res));
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/ollama':
            if (req.method === 'POST') {
              handleOllamaRequest(req, res);
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/refresh-token':
            if (req.method === 'POST') {
              handleRefreshToken(req, res);
            } else {
              res.writeHead(405, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Method not allowed' }));
            }
            break;
          case '/api/verify-token':
            if (req.method === 'GET') {
              handleVerifyToken(req, res);
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
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    }
  });
});

const port = process.env.PORT || 3000;
const host = '0.0.0.0';
server.listen(port, host, () => console.log(`Server listening on http://${host}:${port}`));