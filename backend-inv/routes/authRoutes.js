const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de registro
router.post('/register', authController.register);

// Ruta de login
router.post('/login', authController.login);

// Ruta protegida (ejemplo)
router.get('/protected', authController.verifyToken, (req, res) => {
  res.json({ message: 'Acceso concedido', user: req.user });
});

// Ruta para eliminar la cuenta (requiere autenticación)
router.delete('/delete-account', authController.verifyToken, authController.deleteAccount);

module.exports = router;