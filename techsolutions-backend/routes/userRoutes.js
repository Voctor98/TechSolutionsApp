const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Registrar usuario
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.json({ message: 'Inicio de sesión exitoso', user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
