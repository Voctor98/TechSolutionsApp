const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecreto'; // usa un secreto fuerte en producción

// Registro
exports.registerUser = async (req, res) => {
  const { username, password, email, role } = req.body;

  try {
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
      [username, hashedPassword, email, role || 'user']
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(400).json({ message: 'Correo no encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error("Error al hacer login:", error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
