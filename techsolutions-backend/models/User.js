const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

class User {
    static create(username, email, password, callback) {
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        connection.query(query, [username, email, password], callback);
    }

    static findByEmail(email, callback) {
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], callback);
    }

    static findAll(callback) {
        const query = 'SELECT * FROM users';
        connection.query(query, callback);
    }

    static update(id, username, email, password, callback) {
        const query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
        connection.query(query, [username, email, password, id], callback);
    }

    static delete(id, callback) {
        const query = 'DELETE FROM users WHERE id = ?';
        connection.query(query, [id], callback);
    }
}

module.exports = User;