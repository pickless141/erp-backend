const {Router} = require('express')
const mainRoutes = Router();

const productoRoutes = require('./productoRoutes')
const userRoutes = require('./userRoutes')
const tiendaRoutes = require('./tiendaRoutes')
const produccionesRoutes = require('./produccionRoutes')
const clienteRoutes = require('./clienteRoutes')
const reposicionRoutes = require('./reposicionRoutes')
const pedidoRoutes = require('./pedidoRoutes')
const authRoutes = require('./authRoutes')


mainRoutes.use('/productos', productoRoutes)
mainRoutes.use('/usuarios', userRoutes)
mainRoutes.use('/tiendas', tiendaRoutes)
mainRoutes.use('/producciones', produccionesRoutes)
mainRoutes.use('/clientes', clienteRoutes)
mainRoutes.use('/reposiciones', reposicionRoutes)
mainRoutes.use('/pedidos', pedidoRoutes)
mainRoutes.use('/login', authRoutes)

module.exports = mainRoutes