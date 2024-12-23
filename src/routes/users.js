// Importamos la librería 'bcryptjs' que nos ayuda a manejar contraseñas de manera segura.
// 'sequelize' es la herramienta que usamos para interactuar con la base de datos.
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

// Esta es la función que maneja las solicitudes para obtener la lista de usuarios desde la base de datos.
const handleGetUsers = async (req, res) => {
  try {
    // Usamos Sequelize para buscar todos los usuarios en la base de datos, pero solo obtenemos su 'id' y 'username'.
    const users = await sequelize.models.User.findAll({
      attributes: ['id', 'username']
    });

    // Enviamos una respuesta al cliente con el código de estado 200 (todo salió bien) y los datos de los usuarios en formato JSON.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    // Si ocurre un error al obtener los usuarios, lo mostramos en la consola y respondemos con un error 500.
    console.error('Error fetching users:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error' }));
  }
};

// Esta es la función que maneja las solicitudes para crear un nuevo usuario.
const handleCreateUser = async (req, res) => {
  try {
    // Extraemos el 'username' y la 'password' de los datos que el cliente ha enviado (req.body).
    const { username, password } = JSON.parse(req.body);

    // Si no se proporciona un 'username' o una 'password', lanzamos un error.
    if (!username || !password) {
      throw new Error('Missing username or password');
    }

    // Usamos bcrypt para "encriptar" (cifrar) la contraseña, haciendo que sea más segura.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Usamos Sequelize para crear un nuevo usuario en la base de datos, guardando el 'username' y la contraseña cifrada.
    const user = await sequelize.models.User.create({ username, password: hashedPassword });

    // Mostramos en la consola el ID y nombre de usuario del nuevo usuario creado.
    console.log('New user created:', { id: user.id, username: user.username });

    // Respondemos al cliente con un código de estado 201 (creación exitosa), y los detalles del nuevo usuario.
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Usuario creado', id: user.id, username: user.username }));
  } catch (error) {
    // Si ocurre un error (por ejemplo, si faltan datos o hay un problema al crear el usuario), lo mostramos en la consola.
    // También respondemos al cliente con un error 400 (mala solicitud) y el mensaje de error.
    console.error('Error creating user:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

// Exportamos las funciones 'handleGetUsers' y 'handleCreateUser' para que puedan ser utilizadas en otros archivos.
module.exports = { handleGetUsers, handleCreateUser };




