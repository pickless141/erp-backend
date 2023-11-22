const {Router} = require('express');
const reposicionRoutes = Router();
const reposicionController = require('../controllers/reposicionController/reposicionController.js'); 

reposicionRoutes.post('/', reposicionController.agregarReposicion);
reposicionRoutes.get('/', reposicionController.obtenerReposiciones);
reposicionRoutes.get('/:id', reposicionController.buscarReposicionPorId);
reposicionRoutes.get('/tienda/:tiendaId', reposicionController.obtenerReposicionesPorTienda);

module.exports = reposicionRoutes;