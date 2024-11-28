const {Router} = require('express');
const tiendaRoutes = Router();
const checkRole = require('../middlewares/checkRole.js');
const tiendaController = require('../controllers/tienda/tiendaController.js');


tiendaRoutes.post('/', checkRole(['admin']), tiendaController.crearTienda);

tiendaRoutes.get('/', checkRole(['admin']), tiendaController.obtenerTodasLasTiendas);

tiendaRoutes.get('/tienda/:id', checkRole(['admin']), tiendaController.obtenerTienda);

tiendaRoutes.post('/:tiendaId/nuevoproducto', checkRole(['admin']), tiendaController.añadirProductos);

tiendaRoutes.get('/:id/detalle', checkRole(['admin', 'vendedor']), tiendaController.tiendaDetalle)

tiendaRoutes.get('/tiendaSelect', checkRole(['admin', 'vendedor', 'repositor', 'tercerizado']), tiendaController.tiendaSelect);

tiendaRoutes.get('/:clienteId/tiendas', checkRole(['admin']), tiendaController.obtenerTiendasPorCliente);

tiendaRoutes.put('/:id', checkRole(['admin']), tiendaController.actualizarTienda);

tiendaRoutes.delete('/:id', checkRole(['admin']), tiendaController.eliminarTienda);

module.exports = tiendaRoutes;