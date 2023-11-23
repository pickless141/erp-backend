const {Router} = require('express')
const insumoRoutes = Router();
const insumoController = require('../controllers/insumoController/insumoController.js')

insumoRoutes.post('/', insumoController.crearProducto )
insumoRoutes.get('/', insumoController.obtenerInsumos )
insumoRoutes.get('/:id', insumoController.obtenerProductoPorId )
insumoRoutes.put('/:id', insumoController.actualizarProducto )

module.exports = insumoRoutes;