const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const handleGetUsers = async (req, res) => {
  try {
    const users = await sequelize.models.User.findAll({
      attributes: ['id', 'username']
    });
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await sequelize.models.User.create({ username, password: hashedPassword });
    console.log('New user created:', { id: user.id, username: user.username });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Usuario creado', id: user.id, username: user.username }));
  } catch (error) {
    console.error('Error creating user:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleGetUsers, handleCreateUser };



