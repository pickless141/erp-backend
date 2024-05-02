const {Router} = require('express');
const tiendaRoutes = Router();
const checkRole = require('../middlewares/checkRole.js');
const tiendaController = require('../controllers/tienda/tiendaController.js');


tiendaRoutes.post('/', checkRole(['admin']), tiendaController.crearTienda);


tiendaRoutes.get('/', checkRole(['admin']), tiendaController.obtenerTodasLasTiendas);


tiendaRoutes.get('/tienda/:id', checkRole(['admin']), tiendaController.obtenerTienda);

//Ruta para añadir productos a una tienda
tiendaRoutes.post('/:tiendaId/nuevoproducto', checkRole(['admin']), tiendaController.añadirProductos);

//Ruta para obtener detalles de una tienda
tiendaRoutes.get('/:id/detalle', checkRole(['admin', 'vendedor']), tiendaController.tiendaDetalle)

//Ruta para el select 
tiendaRoutes.get('/tiendaSelect', checkRole(['admin', 'vendedor', 'repositor']), tiendaController.tiendaSelect);

// Ruta para obtener todas las tiendas de un cliente por su ID
tiendaRoutes.get('/:clienteId/tiendas', checkRole(['admin']), tiendaController.obtenerTiendasPorCliente);


tiendaRoutes.put('/:id', checkRole(['admin']), tiendaController.actualizarTienda);


tiendaRoutes.delete('/:id', checkRole(['admin']), tiendaController.eliminarTienda);

module.exports = tiendaRoutes;