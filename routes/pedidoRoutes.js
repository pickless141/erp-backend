const {Router} = require('express');
const pedidoController = require('../controllers/pedidoController/pedidoController.js'); 

const pedidoRoutes = Router();

// Ruta para crear un nuevo pedido
pedidoRoutes.post('/', pedidoController.nuevoPedido);
pedidoRoutes.get('/', pedidoController.obtenerTodosLosPedidos);
pedidoRoutes.put('/:pedidoId/cambiarEstado', pedidoController.cambiarEstadoPedido);
pedidoRoutes.delete('/:pedidoId', pedidoController.eliminarPedido);

module.exports = pedidoRoutes;