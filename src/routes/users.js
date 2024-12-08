const bcrypt = require('bcryptjs');

const users = new Map();

// Crear un usuario de prueba
(async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  users.set(1, { id: 1, username: 'testuser', password: hashedPassword });
  console.log('Test user created:', { id: 1, username: 'testuser' });
})();

const handleGetUsers = (req, res) => {
  const userList = Array.from(users.values()).map(({ id, username }) => ({ id, username }));
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(userList));
};

const handleCreateUser = async (req, res) => {
  try {
    const { username, password } = JSON.parse(req.body);
    if (!username || !password) {
      throw new Error('Missing username or password');
    }
    const id = users.size + 1;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.set(id, { id, username, password: hashedPassword });
    console.log('New user created:', { id, username });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Usuario creado', id, username }));
  } catch (error) {
    console.error('Error creating user:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

module.exports = { handleGetUsers, handleCreateUser, users };



