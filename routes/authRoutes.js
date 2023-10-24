const { Router } = require('express');
const authController = require('../controllers/authController/authController.js');

const authRoutes = Router();

// Ruta para iniciar sesión
authRoutes.post('/', authController.iniciarSesion);

module.exports = authRoutes;