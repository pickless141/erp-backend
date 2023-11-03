const {Router} = require('express');
const pedidoController = require('../controllers/pedidoController/pedidoController.js'); // Asegúrate de ajustar la ubicación de tu controlador

const pedidoRoutes = Router();

// Ruta para crear un nuevo pedido
pedidoRoutes.post('/', pedidoController.nuevoPedido);
pedidoRoutes.get('/', pedidoController.obtenerTodosLosPedidos);
pedidoRoutes.put('/:pedidoId/cambiarEstado', pedidoController.cambiarEstadoPedido);

module.exports = pedidoRoutes;