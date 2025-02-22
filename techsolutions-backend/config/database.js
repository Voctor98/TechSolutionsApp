const { Sequelize } = require('sequelize');

// Configuración de Sequelize
const sequelize = new Sequelize({
  dialect: 'mysql', // o el dialecto que estés usando
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'techsolutionsapp',
  logging: false, // Puedes quitar esto si quieres ver los logs de la consulta
});

module.exports = sequelize;
