const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); // Ruta correcta a userRoutes.js

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas de API
app.use('/api', userRoutes); // <- Esto es importante

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
