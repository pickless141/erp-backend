const {Router} = require('express');
const produccionesRoutes = Router();
const produccionController = require('../controllers/produccion/produccionController.js');

// Ruta para crear una nueva producción
produccionesRoutes.post('/', produccionController.registrarProduccion);
produccionesRoutes.get('/', produccionController.obtenerProducciones);
produccionesRoutes.get('/deposito', produccionController.obtenerProductosDeposito);
produccionesRoutes.put('/deposito/:id', produccionController.editarCantidadDeposito);
produccionesRoutes.delete('/:id', produccionController.eliminarProduccion);

module.exports = produccionesRoutes;