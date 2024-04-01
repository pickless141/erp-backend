const {Router} = require('express');
const tiendaRoutes = Router();
const checkRole = require('../middlewares/checkRole.js');
const tiendaController = require('../controllers/tienda/tiendaController.js');


tiendaRoutes.post('/', checkRole(['admin', 'vendedor']), tiendaController.crearTienda);

tiendaRoutes.get('/', checkRole(['admin', 'vendedor']), tiendaController.obtenerTodasLasTiendas);

tiendaRoutes.get('/tienda/:id', checkRole(['admin', 'vendedor']), tiendaController.obtenerTienda);

tiendaRoutes.post('/:tiendaId/nuevoproducto', checkRole(['admin', 'vendedor']), tiendaController.añadirProductos);

tiendaRoutes.get('/:id/detalle', checkRole(['admin', 'vendedor']), tiendaController.tiendaDetalle)

tiendaRoutes.get('/tiendaSelect', checkRole(['admin', 'vendedor', 'repositor']), tiendaController.tiendaSelect);

tiendaRoutes.get('/:clienteId/tiendas', checkRole(['admin', 'vendedor']), tiendaController.obtenerTiendasPorCliente);

tiendaRoutes.put('/:id', checkRole(['admin', 'vendedor']), tiendaController.actualizarTienda);

tiendaRoutes.delete('/:id', checkRole(['admin', 'vendedor']), tiendaController.eliminarTienda);

module.exports = tiendaRoutes;