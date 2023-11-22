const Reposicion = require('../../models/reposicion/Reposicion.js');
const Tienda = require('../../models/tienda/Tienda.js')

// Controlador para crear una reposición de productos en una tienda
const agregarReposicion = async (req, res) => {
  try {
    const { tiendaId, existenciaAnterior, existenciaActual } = req.body;

    const tienda = await Tienda.findById(tiendaId);
    if (!tienda) {
      return res.status(404).json({ error: 'La tienda no existe' });
    }
    
    const nuevaReposicion = new Reposicion({
      tienda: tiendaId,
      existenciaAnterior,
      existenciaActual,
    });

    await nuevaReposicion.save();

    res.status(201).json({ mensaje: 'Reposición creada exitosamente', reposicion: nuevaReposicion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear una nueva reposición en la tienda' });
  }
};

const obtenerReposiciones = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const reposiciones = await Reposicion.find({})
      .sort({ fechaReposicion: -1 }) 
      .populate('tienda')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalDocs = await Reposicion.countDocuments();

    res.status(200).json({ docs: reposiciones, totalDocs, limit: parseInt(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener reposiciones' });
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

module.exports = { agregarReposicion, obtenerReposiciones, obtenerReposicionesPorTienda, buscarReposicionPorId };