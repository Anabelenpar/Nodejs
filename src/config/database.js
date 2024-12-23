// Importa el módulo Sequelize, que se usa para interactuar con bases de datos.
const { Sequelize } = require('sequelize');
// Importa el módulo dotenv, que permite manejar variables de entorno.
const dotenv = require('dotenv');

// Carga las variables de entorno definidas en un archivo .env (si existen).
dotenv.config();

// Asigna el nombre de la base de datos desde una variable de entorno, o usa un valor por defecto.
const database = process.env.DB_NAME || 'appsueño';
// Asigna el nombre de usuario desde una variable de entorno, o usa un valor por defecto.
const username = process.env.DB_USER || 'postgres';
// Asigna la contraseña desde una variable de entorno, o usa un valor por defecto.
const password = process.env.DB_PASSWORD || 'changeme';
// Asigna el host de la base de datos (donde se encuentra) desde una variable de entorno, o usa un valor por defecto.
const host = process.env.DB_HOST || 'localhost';

// Crea una nueva instancia de Sequelize para conectarse a la base de datos.
const sequelize = new Sequelize(database, username, password, {
  host, // El host donde está la base de datos.
  dialect: 'postgres', // Especifica que estamos usando PostgreSQL como base de datos.
  logging: console.log, // Activa el registro de consultas para que se muestren en la consola.
  dialectOptions: {
    // Si la base de datos usa SSL (encriptación segura), se configura la opción aquí.
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  }
});

// Exporta la instancia de Sequelize para que pueda ser usada en otras partes del código.
module.exports = sequelize;