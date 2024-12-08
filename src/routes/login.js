const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users } = require('./users');

const handleLogin = async (req, res) => {
  try {
    const { username, password } = JSON.parse(req.body);
    console.log('Login attempt:', { username, password }); // Para depuración

    const user = Array.from(users.values()).find(user => user.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful:', { username, userId: user.id }); // Para depuración
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token, userId: user.id }));
    } else {
      console.log('Login failed:', { username }); // Para depuración
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid credentials' }));
    }
  } catch (error) {
    console.error('Login error:', error); // Para depuración
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleLogin };





