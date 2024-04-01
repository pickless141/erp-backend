const {Router} = require('express');
const reposicionRoutes = Router();
const reposicionController = require('../controllers/reposicion/reposicionController.js'); 

reposicionRoutes.post('/', reposicionController.agregarReposicion);
reposicionRoutes.get('/', reposicionController.obtenerReposiciones);
reposicionRoutes.get('/:id', reposicionController.buscarReposicionPorId);
reposicionRoutes.get('/tienda/:tiendaId', reposicionController.obtenerReposicionesPorTienda);
reposicionRoutes.get('/:id/detalles-productos', reposicionController.obtenerDetallesProductos);
reposicionRoutes.delete('/:id', reposicionController.eliminarReposicion);

module.exports = reposicionRoutes;