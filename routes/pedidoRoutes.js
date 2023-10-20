const {Router} = require('express');
const pedidoController = require('../controllers/pedidoController/pedidoController.js'); // Asegúrate de ajustar la ubicación de tu controlador

const pedidoRoutes = Router();

// Ruta para crear un nuevo pedido
pedidoRoutes.post('/', pedidoController.crearPedido);
pedidoRoutes.get('/', pedidoController.obtenerTodosLosPedidos);

module.exports = pedidoRoutes;