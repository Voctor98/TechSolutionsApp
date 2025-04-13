const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// Puerto
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
  
