const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { sequelize, User, SleepEntry } = require('./models');
const { handleGetUsers, handleCreateUser } = require('./routes/users');
const { handleLogin } = require('./routes/login');
const { handleGetSleepData, handlePostSleepData } = require('./routes/data');
const { verifyToken } = require('./middleware/auth');

dotenv.config();

// Initialize database
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    // Create test user if not exists
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
    process.exit(1);  // Exit the process if database connection fails
  }
};

initDatabase();

const server = http.createServer((req, res) => {
  console.log('Received request:', req.method, req.url);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Serve static files
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

  // API routes
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

const port = process.env.PORT || 3000;
const host = '0.0.0.0';
server.listen(port, host, () => console.log(`Server listening on http://${host}:${port}`));