const Reposicion = require('../../models/reposicion/Reposicion.js');
const Tienda = require('../../models/tienda/Tienda.js')

// Controlador para crear una reposición de productos en una tienda
const agregarReposicion = async (req, res) => {
  try {
    const { tiendaId, existenciaAnterior, existenciaActual } = req.body;

    // Verifica si la tienda existe y obtén la información completa de la tienda
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
const obtenerTodasLasReposiciones = async (req, res) => {
  try {
    const { page = 1, search = '' } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Agrega console.log para imprimir más información
    console.log('Página:', page);
    console.log('Skip:', skip);
    
    const filtro = search
      ? { 'tienda.nombreTienda': { $regex: search, $options: 'i' } }
      : {};

    console.log('Filtro:', filtro);

    let reposiciones;
    let totalDocs;

    if (page && limit) {
      // Agrega console.log para imprimir la consulta a la base de datos
      console.log('Consulta a la base de datos:');
      console.log(Reposicion.find(filtro).skip(skip).limit(limit).populate('tienda').toString());

      reposiciones = await Reposicion.find(filtro)
        .skip(skip)
        .limit(limit)
        .populate('tienda');

      totalDocs = await Reposicion.countDocuments(filtro);
    } else {
      reposiciones = await Reposicion.find(filtro).populate('tienda');
      totalDocs = reposiciones.length;
    }

    res.status(200).json({ docs: reposiciones, totalDocs, limit });
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