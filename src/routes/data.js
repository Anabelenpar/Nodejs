// Importamos el modelo de entradas de sueño desde la carpeta de modelos.
const { SleepEntry } = require('../models');

// Esta función maneja las solicitudes para obtener los datos de sueño del usuario.
const handleGetSleepData = async (req, res) => {
  // Obtenemos el ID del usuario de la solicitud (req) que se pasa a través de algún sistema de autenticación.
  const userId = req.userId;
  try {
    // Imprimimos un mensaje en la consola para saber qué usuario está buscando sus datos de sueño.
    console.log('Fetching sleep data for user:', userId);
    
    // Buscamos todas las entradas de sueño del usuario en la base de datos usando su ID.
    const sleepEntries = await SleepEntry.findAll({ where: { userId } });

    // Enviamos la respuesta de vuelta al cliente con el código 200 (éxito) y los datos de sueño del usuario.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ sleepEntries }));
  } catch (error) {
    // Si algo sale mal, mostramos un mensaje de error en la consola y enviamos una respuesta de error al cliente.
    console.error('Error fetching sleep data:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal server error', error: error.message }));
  }
};

// Esta función maneja las solicitudes para agregar nuevos datos de sueño.
const handlePostSleepData = async (req, res) => {
  // Obtenemos el ID del usuario de la solicitud (req).
  const userId = req.userId;
  try {
    // Parseamos (convertimos) el cuerpo de la solicitud (req.body) que contiene los nuevos datos de sueño en formato JSON.
    const sleepEntry = JSON.parse(req.body);
    // Imprimimos un mensaje para saber qué datos estamos agregando para este usuario.
    console.log('Adding sleep entry for user:', userId, sleepEntry);

    // Creamos una nueva entrada de sueño en la base de datos usando los datos recibidos y el ID del usuario.
    const newEntry = await SleepEntry.create({ ...sleepEntry, userId });

    // Enviamos una respuesta de éxito con el código 200 y la nueva entrada de sueño agregada.
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Data added successfully', entry: newEntry }));
  } catch (error) {
    // Si ocurre un error al agregar los datos de sueño, mostramos el error y enviamos una respuesta con un código 400 (petición incorrecta).
    console.error('Error adding sleep entry:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: error.message }));
  }
};

// Exportamos ambas funciones para que puedan ser utilizadas en otras partes de la aplicación.
module.exports = { handleGetSleepData, handlePostSleepData };

