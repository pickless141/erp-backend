const {Router} = require('express');
const produccionesRoutes = Router();
const produccionController = require('../controllers/produccionController/produccionController.js');

// Ruta para crear una nueva producción
produccionesRoutes.post('/', produccionController.registrarProduccion);
produccionesRoutes.get('/', produccionController.obtenerProducciones);

module.exports = produccionesRoutes;