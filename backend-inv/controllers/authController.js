const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize'); // Importar Op desde Sequelize
const User = require('../models/User'); // Asegúrate de que la ruta al modelo sea correcta

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_seguro'; // Usa una variable de entorno para el secreto
const TOKEN_EXPIRATION = '30d'; // Duración del token

const authController = {
  // Función para el registro
  register: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // Generar un token para el nuevo usuario (opcional)
      const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

      // Guardar el token en la base de datos (opcional)
      await User.update({ refreshToken: token }, { where: { id: newUser.id } });

      // Devolver una respuesta exitosa
      res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // Función para el login
  login: async (req, res) => {
    const { identifier, password } = req.body; // Cambiar a 'identifier' para permitir nombre de usuario o email

    try {
      // Buscar al usuario por nombre de usuario o email
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: identifier }, { name: identifier }],
        },
      });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar un nuevo token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

      // Guardar el token en la base de datos (opcional, para invalidar tokens anteriores)
      await User.update({ refreshToken: token }, { where: { id: user.id } });

      // Devolver el token al cliente
      res.json({ token });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // Middleware para verificar el token
  verifyToken: async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del header

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
      // Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Verificar si el token coincide con el almacenado en la base de datos
      const user = await User.findOne({ where: { id: decoded.id, refreshToken: token } });
      if (!user) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      // Adjuntar el usuario al request para su uso en otras rutas
      req.user = user;
      next();
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(401).json({ message: 'Token inválido o expirado' });
    }
  },

  // Función para eliminar la cuenta
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id; // Obtener el ID del usuario desde el token verificado
      await User.destroy({ where: { id: userId } }); // Eliminar el usuario de la base de datos
      res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
};

module.exports = authController;