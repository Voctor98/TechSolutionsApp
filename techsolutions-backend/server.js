const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const db = require('./models/db'); // 🔹 Importar conexión a MySQL

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas de API
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
