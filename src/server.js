const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { handleGetUsers, handleCreateUser } = require('./routes/users');
const { handleLogin } = require('./routes/login');
const { handleGetSleepData, handlePostSleepData } = require('./routes/data');
const { verifyToken } = require('./middleware/auth');

dotenv.config();

connectDB();

const server = http.createServer((req, res) => {
  let { pathname } = new URL(req.url, `http://${req.headers.host}`);
  console.log(pathname);

  if (pathname.startsWith('/js/') || pathname.startsWith('/css/') || pathname === '/index.html' || pathname === '/login.html' || pathname === '/register.html' || pathname === '/') {
      const filepath = path.join(__dirname, '..', 'public', pathname === '/' ? 'index.html' : pathname);
      fs.readFile(filepath, (err, data) => {
          if (err) {
              res.writeHead(404);
              res.end('Not Found');
          } else {
              res.writeHead(200);
              res.end(data);
          }
      });
  } else if (pathname === '/api/users') {
      if (req.method === 'GET') {
          handleGetUsers(req, res);
      } else if (req.method === 'POST') {
          handleCreateUser(req, res);
      }
  } else if (pathname === '/api/login') {
      handleLogin(req, res);
  } else if (pathname === '/api/sleep') {
      if (req.method === 'GET') {
          verifyToken(req, res, handleGetSleepData);
      } else if (req.method === 'POST') {
          verifyToken(req, res, handlePostSleepData);
      }
  } else {
      res.writeHead(404);
      res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server listening on port ${port}`));