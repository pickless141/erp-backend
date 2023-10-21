const Usuario = require('../../models/user/User.js'); // Asegúrate de importar tu modelo de usuario
const bcrypt = require('bcrypt');

// Controlador para crear un nuevo usuario
const crearUsuario = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      password: hashedPassword,
    });

    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Controlador para obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
      const usuarios = await Usuario.find(); // Consulta todos los usuarios
  
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Controlador para obtener un usuario por su ID
const obtenerUsuarioPorId = async (req, res) => {
    const usuarioId = req.params.id;
  
    try {
      const usuario = await Usuario.findById(usuarioId);
  
      if (!usuario) {
        return res.status(404).json({ error: 'El usuario no existe' });
      }
  
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario por ID' });
    }
};

// Controlador para actualizar un usuario por su ID
const actualizarUsuarioPorId = async (req, res) => {
    const usuarioId = req.params.id;
    const datosActualizados = req.body;
  
    try {
      if (datosActualizados.password) {
        // Si la contraseña se actualiza, hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        datosActualizados.password = await bcrypt.hash(datosActualizados.password, salt);
      }
  
      const usuario = await Usuario.findOneAndUpdate({ _id: usuarioId }, datosActualizados, { new: true });
  
      if (!usuario) {
        return res.status(404).json({ error: 'El usuario no existe' });
      }
  
      res.status(200).json({ mensaje: 'Usuario actualizado con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario por ID' });
    }
};

// Controlador para eliminar un usuario por su ID
const eliminarUsuarioPorId = async (req, res) => {
    const usuarioId = req.params.id;
  
    try {
      const usuario = await Usuario.findOneAndDelete({ _id: usuarioId });
  
      if (!usuario) {
        return res.status(404).json({ error: 'El usuario no existe' });
      }
  
      res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario por ID' });
    }
  };;

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuarioPorId,
    eliminarUsuarioPorId
};