const {Router} = require('express')
const mainRoutes = Router();

const productoRoutes = require('./productoRoutes')
const userRoutes = require('./userRoutes')
const produccionesRoutes = require('./produccionRoutes')
const clienteRoutes = require('./clienteRoutes')
const reposicionRoutes = require('./reposicionRoutes')
const pedidoRoutes = require('./pedidoRoutes')


mainRoutes.use('/productos', productoRoutes)
mainRoutes.use('/usuarios', userRoutes)
mainRoutes.use('/producciones', produccionesRoutes)
mainRoutes.use('/clientes', clienteRoutes)
mainRoutes.use('/reposiciones', reposicionRoutes)
mainRoutes.use('/pedidos', pedidoRoutes)

module.exports = mainRoutes