const {Router} = require('express');
const reposicionRoutes = Router();
const reposicionController = require('../controllers/reposicion/reposicionController.js'); 
const filtrarReposiciones = require('../middlewares/filtrosReposiciones')
const checkRole = require('../middlewares/checkRole.js')
const filtroRol = require('../middlewares/filtroRol.js')

reposicionRoutes.post('/', reposicionController.agregarReposicion);
reposicionRoutes.get('/', checkRole(['admin', 'repositor', 'vendedor', 'tercerizado']), filtroRol, reposicionController.obtenerReposiciones);
reposicionRoutes.get('/:id', reposicionController.buscarReposicionPorId);
reposicionRoutes.get('/tienda/:tiendaId', reposicionController.obtenerReposicionesPorTienda);
reposicionRoutes.get('/ultimas/:tiendaId', filtrarReposiciones, reposicionController.ultimasReposicionPorTienda);
reposicionRoutes.get('/:id/detalles-productos', reposicionController.obtenerDetallesProductos);
reposicionRoutes.delete('/:id', reposicionController.eliminarReposicion);

module.exports = reposicionRoutes;