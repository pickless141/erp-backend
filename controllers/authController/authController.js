const Usuario = require('../../models/user/User.js'); // Asegúrate de importar tu modelo de usuario
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.jwtSecret

// Controlador para el inicio de sesión
const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'El Email no es válido' });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(password, usuario.password);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Crear un token JWT
    const token = jwt.sign({ userId: usuario._id, roles: usuario.roles }, jwtSecret, {
      expiresIn: '1h', 
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = {
  iniciarSesion,
};