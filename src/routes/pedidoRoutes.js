const {Router} = require('express');
const pedidoController = require('../controllers/pedidos/pedidoController.js');
const checkRole = require('../middlewares/checkRole.js');

const pedidoRoutes = Router();

pedidoRoutes.post('/', checkRole(['admin']), pedidoController.nuevoPedido);  
pedidoRoutes.get('/', checkRole(['admin', 'vendedor']), pedidoController.obtenerTodosLosPedidos);
pedidoRoutes.get('/:pedidoId', checkRole(['admin', 'vendedor']), pedidoController.obtenerPedidoPorId);

pedidoRoutes.get('/tienda/:tiendaId', checkRole(['admin']), pedidoController.pedidosTienda);
pedidoRoutes.get('/:id/resumenPedido', checkRole(['admin']), pedidoController.pedidoResumen);

pedidoRoutes.put('/:pedidoId/cambiarEstado', checkRole(['admin']), pedidoController.cambiarEstadoPedido);
pedidoRoutes.put('/editar/:pedidoId', checkRole(['admin', 'vendedor']), pedidoController.editarPedido);

pedidoRoutes.delete('/:pedidoId', checkRole(['admin']), pedidoController.eliminarPedido);

pedidoRoutes.post('/vendedor', checkRole(['vendedor', 'admin']), pedidoController.pedidoVendedor);

module.exports = pedidoRoutes;