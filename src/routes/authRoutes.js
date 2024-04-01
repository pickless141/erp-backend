const { Router } = require('express');
const authController = require('../controllers/auth/authController');

const authRoutes = Router();

// Ruta para iniciar sesión
authRoutes.post('/', authController.iniciarSesion);

module.exports = authRoutes;