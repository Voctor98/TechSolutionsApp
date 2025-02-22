require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes'); // Importamos el archivo de rutas combinado

const app = express();
app.use(express.json());

// Usamos las rutas combinadas
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});