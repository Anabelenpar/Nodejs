const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const handleLogin = async (req, res) => {
  try {
    const { username, password } = JSON.parse(req.body);
    console.log('Login attempt:', { username });

    const user = await User.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful:', { username, userId: user._id });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token, userId: user._id }));
    } else {
      console.log('Login failed:', { username });
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid credentials' }));
    }
  } catch (error) {
    console.error('Login error:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleLogin };





