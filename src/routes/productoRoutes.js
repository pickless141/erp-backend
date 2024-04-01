const {Router} = require('express');
const productoRoutes = Router();
const productoController = require('../controllers/productos/productoController');

// Ruta para crear un nuevo producto
productoRoutes.post('/', productoController.crearProducto);
productoRoutes.get('/', productoController.obtenerTodosLosProductos);
productoRoutes.get('/:id', productoController.obtenerProductoPorId);
productoRoutes.put('/:id', productoController.actualizarProductoPorId);
productoRoutes.delete('/:id', productoController.eliminarProducto);

module.exports = productoRoutes;