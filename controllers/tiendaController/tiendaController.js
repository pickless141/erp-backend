const Tienda = require('../../models/tienda/Tienda.js'); // Asegúrate de que la ruta del modelo sea correcta
const Cliente = require('../../models/cliente/Cliente.js'); // Asegúrate de que la ruta del modelo sea correcta

// Controlador para crear una tienda y asignarle un cliente
const crearTienda = async (req, res) => {
  try {
    const { nombreCliente, nombreTienda, direccion, descripcion } = req.body;

    // Verifica si el cliente existe
    const clienteExistente = await Cliente.findById(nombreCliente);

    if (!clienteExistente) {
      return res.status(404).json({ error: 'El cliente no existe' });
    }

    const nuevaTienda = new Tienda({
      nombreCliente,
      nombreTienda,
      direccion,
      descripcion
    });

    await nuevaTienda.save();

    res.status(201).json({ mensaje: 'Tienda creada exitosamente', tienda: nuevaTienda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear una tienda' });
  }
};

//Controlador para traer todas las tiendas
const obtenerTodasLasTiendas = async (req, res) => {
    try {
      const tiendas = await Tienda.find(); // Busca todas las tiendas
  
      res.status(200).json(tiendas); // Envía la lista de tiendas como respuesta
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las tiendas' });
    }
};

//Controlador para traer todas las tiendas de un cliente
const obtenerTiendasPorCliente = async (req, res) => {
    const clienteId = req.params.clienteId; 
  
    try {
      // Busca todas las tiendas relacionadas con el cliente por su ID
      const tiendas = await Tienda.find({ nombreCliente: clienteId });
  
      if (tiendas.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron tiendas para este cliente.' });
      }
  
      res.status(200).json(tiendas);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al buscar tiendas por cliente.' });
    }
};

//Controlador para actualizar informacion de la tienda
const actualizarTienda = async (req, res) => {
    const tiendaId = req.params.id; 
    const { nombreTienda, direccion } = req.body; 
  
    try {
      // Actualiza la tienda por su ID
      const tiendaActualizada = await Tienda.findByIdAndUpdate(
        tiendaId,
        { nombreTienda, direccion },
        { new: true } // Devuelve la tienda actualizada en la respuesta
      );
  
      if (!tiendaActualizada) {
        return res.status(404).json({ error: 'Tienda no encontrada' });
      }
  
      res.status(200).json({mensaje: "Tienda Actualizada con exito!", tienda: tiendaActualizada});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar la tienda' });
    }
};

module.exports = { crearTienda, obtenerTodasLasTiendas, obtenerTiendasPorCliente, actualizarTienda };