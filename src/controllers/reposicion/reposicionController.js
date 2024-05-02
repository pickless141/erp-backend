const Reposicion = require('../../models/reposicion/Reposicion.js');
const Tienda = require('../../models/tienda/Tienda.js')
const Producto = require('../../models/producto/Producto.js')


// Controlador para crear una reposición de productos en una tienda
const agregarReposicion = async (req, res) => {
  try {
    const { tiendaId, productos } = req.body;
    const usuarioId = req.usuarioId;

    const tienda = await Tienda.findById(tiendaId);
    if (!tienda) {
      return res.status(404).json({ error: 'La tienda no existe' });
    }

    const productosConInfo = await Promise.all(productos.map(async (producto) => {
      const productoInfo = await Producto.findById(producto.producto);

      if (!productoInfo) {
        return null; 
      }
      return {
        producto: productoInfo,
        cantidadExhibida: producto.cantidadExhibida,
        deposito: producto.deposito,
        sugerido: producto.sugerido,
        vencidos: producto.vencidos,
        _id: producto._id
      };
    }));

    const productosValidos = productosConInfo.filter(producto => producto !== null);

    const nuevaReposicion = new Reposicion({
      tienda: tiendaId,
      productos: productosValidos,
      usuario: usuarioId
    });

    await nuevaReposicion.save();

    res.status(201).json({ mensaje: 'Reposición creada exitosamente', reposicion: nuevaReposicion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear una nueva reposición en la tienda' });
  }
};

// Controlador para obtener reposiciones con paginación
const obtenerReposiciones = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const reposiciones = await Reposicion.find({})
      .sort({ fechaReposicion: -1 })
      .populate('tienda')
      .populate('usuario', 'nombre apellido email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const reposicionesFiltradas = reposiciones.map(reposicion => {
      const productosCompletos = reposicion.productos.filter(producto =>
        producto.cantidadExhibida !== 0 ||
        producto.deposito !== 0 ||
        producto.sugerido !== 0 ||
        producto.vencidos !== 0
      );
      reposicion.productos = productosCompletos;
      return reposicion;
    });

    const totalDocs = await Reposicion.countDocuments();

    res.status(200).json({ docs: reposicionesFiltradas, totalDocs, limit: parseInt(limit) });
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
      .select('tienda productos fechaReposicion')
      .exec();

    if (!reposicion) {
      return res.status(404).json({ error: 'Reposición no encontrada' });
    }

    const productosCompletos = reposicion.productos.filter(producto =>
      producto.cantidadExhibida !== 0 ||
      producto.deposito !== 0 ||
      producto.sugerido !== 0 ||
      producto.vencidos !== 0
    );

    reposicion.productos = productosCompletos;

    res.status(200).json(reposicion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar la reposición' });
  }
};
const obtenerDetallesProductos = async (req, res) => {
  const reposicionId = req.params.id;

  try {
    const reposicion = await Reposicion.findById(reposicionId).populate('productos.producto');

    if (!reposicion) {
      return res.status(404).json({ error: 'Reposición no encontrada' });
    }

    const productosConInfo = reposicion.productos.map(producto => ({
      producto: producto.producto,
      cantidadExhibida: producto.cantidadExhibida,
      deposito: producto.deposito,
      sugerido: producto.sugerido,
      vencidos: producto.vencidos,
      _id: producto._id
    }));

    res.status(200).json({ productos: productosConInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener detalles de productos de la reposición' });
  }
};

// Controlador para obtener todas las reposiciones de una tienda
const obtenerReposicionesPorTienda = async (req, res) => {
  const tiendaId = req.params.tiendaId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const filter = { tienda: tiendaId };

    const totalReposiciones = await Reposicion.countDocuments(filter);
    const reposiciones = await Reposicion.find(filter)
      .populate('usuario', 'nombre apellido email')
      .skip(skip)
      .limit(limit);

    if (reposiciones.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron reposiciones para esta tienda.' });
    }

    res.status(200).json({
      docs: reposiciones,
      totalDocs: totalReposiciones,
      limit: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reposiciones de la tienda' });
  }
};

//Controlador para eliminar reposiciones
const eliminarReposicion = async (req, res) => {
  const {id} = req.params;

  try {
    const reposicionEliminada = await Reposicion.findOneAndDelete({_id: id})
    if (!reposicionEliminada) {
      return res.status(404).json({ mensaje: 'No se encontró la reposicion con el ID proporcionado.' });
    }
    res.status(200).json({ mensaje: 'Reposicion eliminada con éxito.', reposicion: reposicionEliminada });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error al eliminar la reposicion'})
  }
}

module.exports = { agregarReposicion, obtenerReposiciones, obtenerReposicionesPorTienda, obtenerDetallesProductos, buscarReposicionPorId, eliminarReposicion };