require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306
});

connection.connect(err => {
    if (err) {
        console.error('❌ Error de conexión:', err.code, err.sqlMessage);
    } else {
        console.log('✅ Conexión exitosa a MySQL');
    }
    connection.end();
});
