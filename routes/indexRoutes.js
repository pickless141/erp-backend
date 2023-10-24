const {Router} = require('express')
const mainRoutes = Router();
const checkRole = require('../middlewares/checkRole.js')

const productoRoutes = require('./productoRoutes')
const userRoutes = require('./userRoutes')
const tiendaRoutes = require('./tiendaRoutes')
const produccionesRoutes = require('./produccionRoutes')
const clienteRoutes = require('./clienteRoutes')
const reposicionRoutes = require('./reposicionRoutes')
const pedidoRoutes = require('./pedidoRoutes')
const authRoutes = require('./authRoutes')


mainRoutes.use('/productos', checkRole(['admin', 'vendedor', 'repositor']), productoRoutes)
mainRoutes.use('/usuarios', checkRole(['admin']), userRoutes)
mainRoutes.use('/tiendas', checkRole(['admin', 'vendedor']), tiendaRoutes)
mainRoutes.use('/producciones', checkRole(['admin']), produccionesRoutes)
mainRoutes.use('/clientes', checkRole(['admin']) ,clienteRoutes)
mainRoutes.use('/reposiciones', checkRole(['admin', 'repositor']), reposicionRoutes)
mainRoutes.use('/pedidos', checkRole(['admin', 'vendedor']), pedidoRoutes)
mainRoutes.use('/login', authRoutes)

module.exports = mainRoutes