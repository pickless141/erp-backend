const {Router} = require('express')
const clienteRoutes = Router();
const clienteController = require('../controllers/clienteController/clienteController.js')

clienteRoutes.post('/', clienteController.crearCliente)
clienteRoutes.get('/', clienteController.obtenerTodosLosClientes)
clienteRoutes.get('/clienteSelect', clienteController.clienteSelect)
clienteRoutes.get('/:id', clienteController.obtenerClientePorId)
clienteRoutes.put('/:id', clienteController.editarClientePorId)
clienteRoutes.delete('/:id', clienteController.borrarClientePorId)

module.exports = clienteRoutes;