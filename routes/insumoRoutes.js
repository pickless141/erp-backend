const {Router} = require('express')
const insumoRoutes = Router();
const insumoController = require('../controllers/insumoController/insumoController.js')

insumoRoutes.post('/', insumoController.crearProducto )

module.exports = insumoRoutes;