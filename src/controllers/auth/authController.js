const Usuario = require('../../models/user/User.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.jwtSecret

// Controlador para el inicio de sesión
const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'El Email no es válido' });
    }

    const contrasenaValida = await bcrypt.compare(password, usuario.password);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    
    const token = jwt.sign({ userId: usuario._id, roles: usuario.roles, nombre: usuario.nombre, apellido: usuario.apellido}, jwtSecret, {
      expiresIn: '1h', 
    });
    

    res.status(200).json({ token, nombre: usuario.nombre, apellido: usuario.apellido });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = {
  iniciarSesion,
};