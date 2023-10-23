const Reposicion = require('../../models/reposicion/Reposicion.js');
const Producto = require('../../models/producto/Producto.js');
const Tienda = require('../../models/tienda/Tienda.js')

// Controlador para crear una reposición de productos en una tienda
const agregarReposicion = async (req, res) => {
  try {
    const { tiendaId, existenciaAnterior, existenciaActual } = req.body;

    // Verifica si la tienda existe
    const tienda = await Tienda.findById(tiendaId);
    if (!tienda) {
      return res.status(404).json({ error: 'La tienda no existe' });
    }

    // Crea la reposición de productos
    const nuevaReposicion = new Reposicion({
      tienda: tiendaId,
      existenciaAnterior,
      existenciaActual,
    });

    // Guarda la reposición en la base de datos
    await nuevaReposicion.save();

    res.status(201).json({ mensaje: 'Reposición creada exitosamente', reposicion: nuevaReposicion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear una nueva reposición en la tienda' });
  }
};

// Controlador para obtener todas las reposiciones
const obtenerTodasLasReposiciones = async (req, res) => {
  try {
    const reposiciones = await Reposicion.find();

    res.status(200).json(reposiciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reposiciones' });
  }
};

// Controlador para buscar una reposición por ID
const buscarReposicionPorId = async (req, res) => {
  const reposicionId = req.params.id; 

  try {
    const reposicion = await Reposicion.findById(reposicionId)
      .select('existenciaAnterior existenciaActual fechaReposicion')
      .exec();

    if (!reposicion) {
      return res.status(404).json({ error: 'Reposición no encontrada' });
    }

    res.status(200).json(reposicion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar la reposición' });
  }
};
// Controlador para obtener todas las reposiciones de una tienda
const obtenerReposicionesPorTienda = async (req, res) => {
  const tiendaId = req.params.tiendaId; 

  try {
    const reposiciones = await Reposicion.find({ tienda: tiendaId });

    res.status(200).json(reposiciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reposiciones de la tienda' });
  }
};

module.exports = { agregarReposicion, obtenerTodasLasReposiciones, obtenerReposicionesPorTienda, buscarReposicionPorId };