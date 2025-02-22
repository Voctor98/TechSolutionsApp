const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nombre de la base de datos
  process.env.DB_USER,     // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST,    // Host de la base de datos
    dialect: process.env.DB_DIALECT, // Dialecto (mysql, postgres, etc.)
  }
);

module.exports = sequelize;