const {Router} = require('express');
const userRoutes = Router();
const userController = require('../controllers/users/userController.js');

userRoutes.post('/', userController.crearUsuario);
userRoutes.get('/', userController.obtenerUsuarios);
userRoutes.get('/:id', userController.obtenerUsuarioPorId);
userRoutes.put('/:id', userController.actualizarUsuarioPorId);
userRoutes.delete('/:id', userController.eliminarUsuarioPorId);


module.exports = userRoutes;