const { Router } = require('express');
const { tiendasConMasPedidos, usuariosReposiciones, productosMasVendidos, productosMasVendidosPorTienda, ventasMensuales } = require('../controllers/estadisticas/estadisticasController.js');
const checkRole = require('../middlewares/checkRole.js');

const estadisticasRoutes = Router();

estadisticasRoutes.get('/ventas', checkRole(['admin', 'vendedor']), tiendasConMasPedidos);

estadisticasRoutes.get('/usuarios-reposiciones', checkRole(['admin']), usuariosReposiciones);

estadisticasRoutes.get('/productos-mas-vendidos', checkRole(['admin']), productosMasVendidos);

estadisticasRoutes.get('/productos-mas-vendidos/:tiendaId', checkRole(['admin']), productosMasVendidosPorTienda)

estadisticasRoutes.get('/ventas-mensuales', checkRole(['admin']), ventasMensuales);

module.exports = estadisticasRoutes;