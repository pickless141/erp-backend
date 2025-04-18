const {Router} = require('express')
const mainRoutes = Router();
const checkRole = require('../middlewares/checkRole.js')

const productoRoutes = require('./productoRoutes.js')
const userRoutes = require('./userRoutes.js')
const tiendaRoutes = require('./tiendaRoutes.js')
const produccionesRoutes = require('./produccionRoutes.js')
const clienteRoutes = require('./clienteRoutes.js')
const reposicionRoutes = require('./reposicionRoutes.js')
const pedidoRoutes = require('./pedidoRoutes.js')
const authRoutes = require('./authRoutes.js')
const insumoRoutes = require('./insumoRoutes.js')
const estadisticasRoutes = require('./estadisticasRoutes.js');
const facturacionRoutes = require('./facturacionRoutes.js');


mainRoutes.use('/productos', checkRole(['admin', 'vendedor', 'repositor', 'tercerizado', 'produccion']), productoRoutes)
mainRoutes.use('/usuarios', checkRole(['admin']), userRoutes)
mainRoutes.use('/tiendas', tiendaRoutes);
mainRoutes.use('/producciones', checkRole(['admin', 'produccion']), produccionesRoutes)
mainRoutes.use('/insumos', checkRole(['admin', 'produccion']), insumoRoutes)
mainRoutes.use('/clientes', checkRole(['admin']), clienteRoutes)
mainRoutes.use('/reposiciones', checkRole(['admin','vendedor','repositor', 'tercerizado']), reposicionRoutes)
mainRoutes.use('/facturacion', checkRole(['admin']), facturacionRoutes)
mainRoutes.use('/pedidos', pedidoRoutes)
mainRoutes.use('/login', authRoutes)
mainRoutes.use('/estadisticas', estadisticasRoutes);

module.exports = mainRoutes