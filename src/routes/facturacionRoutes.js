const {Router} = require('express');
const facturacionRoutes = Router();
const facturacionController = require('../controllers/facturacion/facturacionController');

facturacionRoutes.post('/crear-factura', facturacionController.crearFactura);
facturacionRoutes.get('/facturas', facturacionController.obtenerFacturas);


module.exports = facturacionRoutes;