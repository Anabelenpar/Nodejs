const User = require('../models/User');
const bcrypt = require('bcryptjs');

const handleGetUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'id username');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

const handleCreateUser = async (req, res) => {
  try {
    const { username, password } = JSON.parse(req.body);
    if (!username || !password) {
      throw new Error('Missing username or password');
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    const newUser = new User({ username, password });
    await newUser.save();
    console.log('New user created:', { id: newUser._id, username });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Usuario creado', id: newUser._id, username }));
  } catch (error) {
    console.error('Error creating user:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleGetUsers, handleCreateUser };



