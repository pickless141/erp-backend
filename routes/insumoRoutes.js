const {Router} = require('express')
const insumoRoutes = Router();
const insumoController = require('../controllers/insumoController/insumoController.js')

insumoRoutes.post('/', insumoController.crearProducto )
insumoRoutes.get('/', insumoController.obtenerProductos )
insumoRoutes.patch('/', insumoController.actualizarProducto )

module.exports = insumoRoutes;