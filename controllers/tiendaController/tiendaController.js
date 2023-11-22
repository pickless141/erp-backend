const Tienda = require('../../models/tienda/Tienda.js'); 
const Cliente = require('../../models/cliente/Cliente.js'); 

// Controlador para crear una tienda y asignarle un cliente
const crearTienda = async (req, res) => {
  try {
    const { nombreCliente, nombreTienda, direccion, descripcion } = req.body;

    
    let clienteExistente = await Cliente.findOne({ nombre: nombreCliente });

    if (!clienteExistente) {
      clienteExistente = new Cliente({
        nombre: nombreCliente,
      });
      await clienteExistente.save();
    }

    const nuevaTienda = new Tienda({
      cliente: clienteExistente._id, 
      nombreCliente: nombreCliente, 
      nombreTienda,
      direccion,
      descripcion,
    });

    await nuevaTienda.save();

    res.status(201).json({ mensaje: 'Tienda creada exitosamente', tienda: nuevaTienda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear una tienda' });
  }
};

// Controlador para traer todas las tiendas con paginación y búsqueda opcional
const obtenerTodasLasTiendas = async (req, res) => {
  try {
    const { page = 1, search = '' } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const filtro = search
      ? { $or: [{ nombreTienda: { $regex: search, $options: 'i' } }] }
      : {};

    let tiendas;
    let totalDocs;

    if (page && limit) {
      tiendas = await Tienda.find(filtro).skip(skip).limit(limit);
      totalDocs = await Tienda.countDocuments(filtro);
    } else {
      tiendas = await Tienda.find(filtro);
      totalDocs = tiendas.length;
    }

    res.status(200).json({ docs: tiendas, totalDocs, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener todas las tiendas' });
  }
};
// Controlador para obtener una tienda por su ID
const obtenerTienda = async (req, res) => {
  const tiendaId = req.params.id;
  try {
    const tienda = await Tienda.findById(tiendaId);

    if (!tienda) {
      return res.status(404).json({ mensaje: 'No se encontró la tienda.' });
    }

    res.status(200).json(tienda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la tienda' });
  } 
};

// Controlador para traer todas las tiendas de un cliente
const obtenerTiendasPorCliente = async (req, res) => {
  const clienteId = req.params.clienteId;
  try {
      const tiendas = await Tienda.find({ cliente: clienteId });
      
      if (tiendas.length === 0) {
          return res.status(404).json({ mensaje: 'No se encontraron tiendas para este cliente.' });
      }

      res.status(200).json(tiendas);
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al buscar tiendas por cliente.' });
  }
};

// Nuevo controlador para obtener todas las tiendas sin límites ni paginación
const tiendaSelect = async (req, res) => {
  try {
    const tiendas = await Tienda.find();
    res.status(200).json(tiendas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener todas las tiendas' });
  }
};

// Controlador para actualizar información de la tienda
const actualizarTienda = async (req, res) => {
  const tiendaId = req.params.id;
  const datosActualizados = req.body;

  try {
    const tienda = await Tienda.findByIdAndUpdate(tiendaId, datosActualizados, {
      new: true,
    });

    if (!tienda) {
      return res.status(404).json({ error: 'La tienda no existe' });
    }

    res.status(200).json(tienda);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tienda' });
  }
};

module.exports = { crearTienda, obtenerTodasLasTiendas, obtenerTienda, obtenerTiendasPorCliente, tiendaSelect,actualizarTienda };