const {Router} = require('express');
const produccionesRoutes = Router();
const produccionController = require('../controllers/produccion/produccionController.js');

// Ruta para crear una nueva producción
produccionesRoutes.post('/', produccionController.registrarProduccion);
produccionesRoutes.get('/', produccionController.obtenerProducciones);
produccionesRoutes.delete('/:id', produccionController.eliminarProduccion);

module.exports = produccionesRoutes;