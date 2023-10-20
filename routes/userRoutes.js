const {Router} = require('express');
const userRoutes = Router();
const userController = require('../controllers/userController/userController.js');

userRoutes.post('/', userController.crearUsuario);
userRoutes.get('/', userController.obtenerUsuarios);
userRoutes.get('/:id', userController.obtenerUsuarioPorId);
userRoutes.put('/:id', userController.actualizarUsuarioPorId);
userRoutes.delete('/:id', userController.eliminarUsuarioPorId);
// Y otras rutas relacionadas con usuarios

module.exports = userRoutes;