const {Router} = require('express')
const insumoRoutes = Router();
const insumoController = require('../controllers/insumos/insumoController.js')

insumoRoutes.post('/', insumoController.crearInsumo )
insumoRoutes.get('/', insumoController.obtenerInsumos )
insumoRoutes.get('/:id', insumoController.obtenerInsumoPorId )
insumoRoutes.put('/:id', insumoController.actualizarInsumo )
insumoRoutes.delete('/:id', insumoController.eliminarInsumo)

module.exports = insumoRoutes;