const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const dotenv = require('dotenv');
const { handleGetUsers, handleCreateUser } = require('./routes/users');
const { handleLogin } = require('./routes/login');
const { handleGetSleepData, handlePostSleepData } = require('./routes/data');
const { verifyToken } = require('./middleware/auth');

dotenv.config();

const server = http.createServer((req, res) => {
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
server.listen(port, () => console.log(`Server listening on port ${port}`));