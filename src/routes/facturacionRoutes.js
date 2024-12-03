const {Router} = require('express');
const facturacionRoutes = Router();
const facturacionController = require('../controllers/facturacion/facturacionController');

facturacionRoutes.post('/crear-factura', facturacionController.crearFactura);
facturacionRoutes.get('/facturas', facturacionController.obtenerFacturas);
facturacionRoutes.delete('/:facturaId', facturacionController.eliminarFactura)


module.exports = facturacionRoutes;