const mongoose = require('mongoose');
const Reposicion = require('../../models/reposicion/Reposicion.js');
const Tienda = require('../../models/tienda/Tienda.js')
const Producto = require('../../models/producto/Producto.js')
const Categoria = require('../../models/categoria/Categoria.js');


// Controlador para crear una reposición de productos en una tienda
const agregarReposicion = async (req, res) => {
  try {
    const { tiendaId, productos = [], comentario } = req.body;
    const usuarioId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(tiendaId)) {
      return res.status(400).json({ error: 'tiendaId inválido' });
    }
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Debe enviar al menos un producto' });
    }

    const tienda = await Tienda.findById(tiendaId).select('_id');
    if (!tienda) return res.status(404).json({ error: 'La tienda no existe' });

    const productosConInfo = productos.map(item => ({
      producto: item.producto, 
      cantidadExhibida: Number(item.cantidadExhibida) || 0,
      deposito:        Number(item.deposito) || 0,
      sugerido:        Number(item.sugerido) || 0,
      vencidos:        Number(item.vencidos) || 0,
      _id: item._id, 
    }));

    const nuevaReposicion = await Reposicion.create({
      tienda: tiendaId,
      productos: productosConInfo,
      usuario: usuarioId,
      comentario,
    });

    const reposicionPop = await Reposicion.findById(nuevaReposicion._id)
      .populate('tienda')
      .populate('usuario')
      .populate({
        path: 'productos.producto',
        select: 'nombreProducto lote codBarra existencia categoria',
        populate: { path: 'categoria', select: 'nombre' }
      });

    return res.status(201).json({
      mensaje: 'Reposición creada exitosamente',
      reposicion: reposicionPop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear una nueva reposición en la tienda' });
  }
};

// Controlador para obtener reposiciones con paginación
const obtenerReposiciones = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '', categoriaId } = req.query;

    const filter = {};

    if (req.user && req.user.empresa === 'EatWell') {
      const productosEatWell = await Producto.find({ categoria: 'EatWell' }).select('_id');
      filter['productos.producto'] = { $in: productosEatWell.map(p => p._id) };
    }

    if (search) {
      const tiendas = await Tienda.find({ nombreTienda: { $regex: search, $options: 'i' } }).select('_id');
      filter['tienda'] = { $in: tiendas.map(t => t._id) };
    }

    if (categoriaId) {
      if (!mongoose.Types.ObjectId.isValid(categoriaId)) {
        return res.status(400).json({ error: 'categoriaId inválido' });
      }
      const prodsCat = await Producto.find({ categoria: categoriaId }).select('_id');
      const idsCat = prodsCat.map(p => String(p._id));

      if (filter['productos.producto']) {
        const prev = (filter['productos.producto'].$in || []).map(id => String(id));
        const prevSet = new Set(prev);
        const inter = idsCat.filter(id => prevSet.has(id));

        if (inter.length === 0) {
          return res.status(200).json({ docs: [], totalDocs: 0, limit });
        }
        filter['productos.producto'] = { $in: inter };
      } else {
        filter['productos.producto'] = { $in: prodsCat.map(p => p._id) };
      }
    }

    const skip = (page - 1) * limit;

    const [reposiciones, totalDocs] = await Promise.all([
      Reposicion.find(filter)
        .populate('tienda')
        .populate('usuario')
        .populate({
          path: 'productos.producto',
          populate: { path: 'categoria', select: 'nombre' }
        })
        .sort({ fechaReposicion: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .exec(),
      Reposicion.countDocuments(filter),
    ]);

    res.status(200).json({ docs: reposiciones, totalDocs, limit });
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

    
    const productosConInfo = reposicion.productos.filter(producto => 
      producto.cantidadExhibida > 0 ||
      producto.deposito > 0 ||
      producto.sugerido > 0 ||
      producto.vencidos > 0
    ).map(producto => ({
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
      .populate('productos.producto', 'categoria nombreProducto')
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

const ultimasReposicionPorTienda = async (req, res) => {
  try {
    const { tiendaId } = req.params;
    const { categoria: categoriaId } = req.query; 

    const reposicionesPorTienda = req.reposicionesFiltradas || [];

    const reposicionesFiltradasPorCategoria = reposicionesPorTienda.map((repDoc) => {
      const rep = repDoc.toObject ? repDoc.toObject() : repDoc;

      const productosFiltrados = rep.productos.filter((item) => {
        const cat = item?.producto?.categoria;
        const catId =
          typeof cat === 'string'
            ? cat
            : (cat && (cat._id || cat))?.toString?.();
        return !categoriaId || (catId && catId === categoriaId);
      });

      return { ...rep, productos: productosFiltrados };
    });

    const reposicionesValidas = reposicionesFiltradasPorCategoria.filter(
      (rep) => rep.productos.length > 0
    );

    const ultimasReposiciones = reposicionesValidas
      .sort((a, b) => new Date(b.fechaReposicion) - new Date(a.fechaReposicion))
      .slice(0, 2);

    if (ultimasReposiciones.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron reposiciones para esta tienda y categoría.',
      });
    }

    return res.status(200).json({ reposiciones: ultimasReposiciones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Error al obtener las últimas reposiciones de la tienda y categoría.',
    });
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

module.exports = { agregarReposicion, obtenerReposiciones, obtenerReposicionesPorTienda, obtenerDetallesProductos, buscarReposicionPorId, ultimasReposicionPorTienda, eliminarReposicion };