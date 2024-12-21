const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const database = process.env.DB_NAME || 'appsueño';
const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'changeme';
const host = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  }
});

module.exports = sequelize;