const {Router} = require('express');
const produccionesRoutes = Router();
const produccionController = require('../controllers/produccionController/produccionController.js');

// Ruta para crear una nueva producción
produccionesRoutes.post('/', produccionController.crearProduccion);
produccionesRoutes.get('/', produccionController.obtenerTodasLasProducciones);

module.exports = produccionesRoutes;