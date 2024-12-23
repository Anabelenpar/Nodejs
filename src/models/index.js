// Importa el tipo de datos necesarios de Sequelize para definir los modelos.
const { DataTypes } = require('sequelize');
// Importa la configuración de la base de datos que se usará para conectar con la base de datos.
const sequelize = require('../config/database');

// Define el modelo "User" que representa a un usuario en la base de datos.
const User = sequelize.define('User', {
  // Define el campo "username" (nombre de usuario).
  username: {
    type: DataTypes.STRING, // El campo es una cadena de texto (string).
    allowNull: false, // No se permite que el nombre de usuario sea vacío.
    unique: true // El nombre de usuario debe ser único, no puede repetirse.
  },
  // Define el campo "password" (contraseña).
  password: {
    type: DataTypes.STRING, // El campo es una cadena de texto (string).
    allowNull: false // No se permite que la contraseña esté vacía.
  }
}, { tableName: 'users' }); // Indica que este modelo debe guardarse en la tabla "users" de la base de datos.

// Define el modelo "SleepEntry" que representa una entrada de sueño en la base de datos.
const SleepEntry = sequelize.define('SleepEntry', {
  // Define el campo "date" (fecha)
  date: {
    type: DataTypes.DATEONLY, // El campo es solo una fecha (sin hora).
    allowNull: false // No se permite que la fecha esté vacía.
  },
  // Define el campo "duration" (duración del sueño).
  duration: {
    type: DataTypes.FLOAT, // El campo es un número decimal (float).
    allowNull: false // No se permite que la duración esté vacía.
  },
  // Define el campo "quality" (calidad del sueño).
  quality: {
    type: DataTypes.INTEGER, // El campo es un número entero (integer).
    allowNull: false // No se permite que la calidad esté vacía.
  }
}, { tableName: 'sleep_entries' }); // Indica que este modelo debe guardarse en la tabla "sleep_entries" de la base de datos.

// Define una relación entre los modelos "User" y "SleepEntry":
// Un usuario puede tener muchas entradas de sueño (relación uno a muchos).
User.hasMany(SleepEntry, { as: 'sleepEntries', foreignKey: 'userId' });
// Una entrada de sueño pertenece a un solo usuario (relación inversa).
SleepEntry.belongsTo(User, { foreignKey: 'userId' });

// Exporta los modelos y la conexión a la base de datos para que puedan ser usados en otras partes del código.
module.exports = {
  sequelize, // Exporta la conexión a la base de datos.
  User, // Exporta el modelo "User".
  SleepEntry // Exporta el modelo "SleepEntry".
};