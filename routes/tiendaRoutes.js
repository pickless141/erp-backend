const {Router} = require('express');
const tiendaRoutes = Router();
const tiendaController = require('../controllers/tiendaController/tiendaController.js'); // Asegúrate de que la ruta del controlador sea correcta

// Ruta para crear una tienda y asignarle un cliente
tiendaRoutes.post('/', tiendaController.crearTienda);

//Ruta para obtener todas las tiendas registradas 
tiendaRoutes.get('/', tiendaController.obtenerTodasLasTiendas);

//Ruta para obtener una tienda
tiendaRoutes.get('/tienda/:id', tiendaController.obtenerTienda);

tiendaRoutes.get('/tiendaSelect', tiendaController.tiendaSelect);

// Ruta para obtener todas las tiendas de un cliente por su ID
tiendaRoutes.get('/:clienteId/tiendas', tiendaController.obtenerTiendasPorCliente);

//Ruta para actualizar tienda
tiendaRoutes.put('/:id', tiendaController.actualizarTienda);

module.exports = tiendaRoutes;