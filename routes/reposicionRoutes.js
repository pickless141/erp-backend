const {Router} = require('express');
const reposicionRoutes = Router();
const reposicionController = require('../controllers/reposicionController/reposicionController.js'); // Asegúrate de que la ruta al controlador sea correcta

// Ruta para agregar una reposición de productos
reposicionRoutes.post('/', reposicionController.agregarReposicion);
reposicionRoutes.get('/', reposicionController.obtenerTodasLasReposiciones);
reposicionRoutes.get('/:id', reposicionController.buscarReposicionPorId);
reposicionRoutes.get('/tienda/:tiendaId', reposicionController.obtenerReposicionesPorTienda);

module.exports = reposicionRoutes;