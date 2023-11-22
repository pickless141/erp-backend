const Cliente = require('../../models/cliente/Cliente.js');

// Controlador para crear un nuevo cliente y mostrar un mensaje de éxito
const crearCliente = async (req, res) => {
  const { nombre, email, ruc, telefono } = req.body;

  try {
    const nuevoCliente = new Cliente({
      nombre,
      email,
      ruc,
      telefono,
    });

    await nuevoCliente.save();

    res.status(201).json({ mensaje: 'Cliente creado exitosamente', cliente: nuevoCliente });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear un nuevo cliente' });
  }
};

// Controlador para obtener todos los clientes con paginación y búsqueda opcional
const obtenerTodosLosClientes = async (req, res) => {
  try {
    const { page = 1, search = '' } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const filtro = search
      ? { $or: [{ nombre: { $regex: search, $options: 'i' } }] }
      : {};

    const clientes = await Cliente.find(filtro).skip(skip).limit(limit);
    const totalDocs = await Cliente.countDocuments(filtro);

    res.status(200).json({ docs: clientes, totalDocs, limit });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todos los clientes' });
  }
};

// Controlador para obtener un cliente por su ID
const obtenerClientePorId = async (req, res) => {
    const clienteId = req.params.id;
  
    try {
      const cliente = await Cliente.findById(clienteId);
  
      if (!cliente) {
        return res.status(404).json({ error: 'El cliente no existe' });
      }
  
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el cliente por ID' });
    }
};
//Controlador para obtener todos los clientes
const clienteSelect = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener todos los clientes' });
  }
};

// Controlador para editar un cliente por su ID
const editarClientePorId = async (req, res) => {
    const clienteId = req.params.id;
    const datosActualizados = req.body;
  
    try {
      delete datosActualizados._id; 
  
      const cliente = await Cliente.findOneAndUpdate({ _id: clienteId }, datosActualizados, {
        new: true,
      });
  
      if (!cliente) {
        return res.status(404).json({ error: 'El cliente no existe' });
      }
  
      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el cliente por ID' });
    }
};

// Controlador para borrar un cliente por su ID
const borrarClientePorId = async (req, res) => {
    const clienteId = req.params.id;
  
    try {
      const cliente = await Cliente.findOneAndDelete({ _id: clienteId });
  
      if (!cliente) {
        return res.status(404).json({ error: 'El cliente no existe' });
      }
  
      res.status(200).json({ mensaje: 'Cliente eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el cliente por ID' });
    }
};

module.exports = { crearCliente, obtenerTodosLosClientes, obtenerClientePorId, clienteSelect, editarClientePorId, borrarClientePorId };