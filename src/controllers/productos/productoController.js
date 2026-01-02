const mongoose = require('mongoose');
const Producto = require('../../models/producto/Producto');
const Categoria = require('../../models/categoria/Categoria');

// Controlador para crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { nombreProducto, lote, codBarra, categoriaId, categoriaNombre } = req.body;

    if (!nombreProducto?.trim()) {
      return res.status(400).json({ error: 'nombreProducto es requerido' });
    }

    let categoriaDoc;

    if (categoriaId) {
      categoriaDoc = await Categoria.findById(categoriaId);
      if (!categoriaDoc) {
        return res.status(400).json({ error: 'La categoría indicada no existe' });
      }
    } else if (categoriaNombre?.trim()) {
      const nombre = categoriaNombre.trim();
      categoriaDoc = await Categoria.findOneAndUpdate(
        { nombre },
        { $setOnInsert: { nombre } },
        { new: true, upsert: true }
      );
    } else {
      return res.status(400).json({ error: 'Enviá categoriaId o categoriaNombre' });
    }

    const producto = await Producto.create({
      nombreProducto: nombreProducto.trim(),
      lote,
      codBarra,
      categoria: categoriaDoc._id
    });

    await producto.populate('categoria', 'nombre');

    return res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto
    });
  } catch (error) {
    if (error?.code === 11000) {
      const campo = Object.keys(error.keyPattern || {})[0] || 'campo único';
      return res.status(409).json({ error: `Valor duplicado en ${campo}` });
    }
    console.error(error);
    return res.status(500).json({ error: 'Error al crear un nuevo producto' });
  }
}
// Controlador para obtener todos los productos
const obtenerTodosLosProductos = async (req, res) => {
  try {
    const { search = '', categoriaId = '', page = 1, limit = 10} = req.query;

    const filters = {};

    if (req.user?.empresa === 'EatWell') {
      const categoriaEatWell = await Categoria.findOne({ nombre: 'EatWell' }).select('_id');
    
      if (!categoriaEatWell) {
        return res.status(200).json({
          total: 0,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: 0,
          productos: [],
        });
      }
    
      filters.categoria = categoriaEatWell._id;
    }

    if (search.trim()) {
      filters.nombreProducto = { $regex: search.trim(), $options: 'i' }; 
    }

    if (categoriaId && mongoose.Types.ObjectId.isValid(categoriaId)) {
      filters.categoria = categoriaId;
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const total = await Producto.countDocuments(filters);

    const productos = await Producto.find(filters)
      .populate('categoria', 'nombre')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();

    res.status(200).json({
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      productos,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Controlador para obtener un producto por su ID
const obtenerProductoPorId = async (req, res) => {
  const productoId = req.params.id;

  try {
    const producto = await Producto.findById(productoId);

    if (!producto) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};
const productosSelect = async (req, res) => {
  try {
    const { q = "", limit = 100, format } = req.query;

    const filter = {};
    if (q && q.trim()) {
      filter.nombreProducto = { $regex: q.trim(), $options: "i" };
    }

    const pageSize = Math.min(parseInt(limit, 10) || 100, 500);

    const productos = await Producto.find(filter)
      .sort({ nombreProducto: 1 })
      .select("_id nombreProducto categoria codBarra lote")
      .populate("categoria", "nombre")
      .limit(pageSize)
      .lean();

    if (format === "options") {
      const options = productos.map(p => ({
        value: p._id,
        label: p.nombreProducto,
        categoriaId: p.categoria?._id || null,
        categoriaNombre: p.categoria?.nombre || null,
        codBarra: p.codBarra || null,
        lote: p.lote || null,
      }));
      return res.status(200).json(options);
    }
    return res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos para select:", error);
    return res.status(500).json({ error: "Error al obtener los productos para el select" });
  }
};
//Controlador para actualizar 
const actualizarProductoPorId = async (req, res) => {
  const productoId = req.params.id;
  const { nombreProducto, lote, existencia, codBarra, categoriaId, categoriaNombre } = req.body;

  try {
    const productoExistente = await Producto.findById(productoId);
    if (!productoExistente) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    let categoriaAsignar = null;

    if (categoriaId) {
      if (!mongoose.Types.ObjectId.isValid(categoriaId)) {
        return res.status(400).json({ error: 'categoriaId inválido' });
      }
      const cat = await Categoria.findById(categoriaId);
      if (!cat) return res.status(400).json({ error: 'La categoría indicada no existe' });
      categoriaAsignar = cat._id;
    } else if (categoriaNombre && categoriaNombre.trim()) {
      const nombre = categoriaNombre.trim();
      const cat = await Categoria.findOneAndUpdate(
        { nombre },
        { $setOnInsert: { nombre } },
        { new: true, upsert: true }
      );
      categoriaAsignar = cat._id;
    }

    const update = { nombreProducto, lote, existencia, codBarra };
    if (categoriaAsignar) update.categoria = categoriaAsignar; 

    const producto = await Producto.findOneAndUpdate(
      { _id: productoId },
      update,
      { new: true }
    ).populate('categoria', 'nombre'); 

    if (!producto) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', producto });
  } catch (error) {
    if (error?.code === 11000) {
      const campo = Object.keys(error.keyPattern || {})[0] || 'campo único';
      return res.status(409).json({ error: `Valor duplicado en ${campo}` });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const obtenerCategorias = async (req, res) => {
  try {
    const { includeInactivas = 'false', q = '', format } = req.query;
    
    const filter = includeInactivas === 'true' ? {} : { activa: true };
    if (req.user?.empresa === 'EatWell') {
      filter.nombre = 'EatWell';
    } else if (q) {
      filter.nombre = { $regex: q, $options: 'i' };
    }

    const categorias = await Categoria.find(filter)
      .sort({ nombre: 1 })
      .select('nombre activa');

    if (format === 'options') {
      return res.status(200).json(
        categorias.map(c => ({
          value: c._id,
          label: c.nombre,
          activa: c.activa
        }))
      );
    }

    return res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener las categorías' });
  }
};
const productosPorCategoria = async (req, res) => {
  try {
    const categoriaId = req.params.categoriaId || req.query.categoriaId;
    const { q = "", format } = req.query;

    if (!categoriaId || !mongoose.Types.ObjectId.isValid(categoriaId)) {
      return res.status(400).json({ error: "categoriaId inválido o no enviado" });
    }

    const existe = await Categoria.exists({ _id: categoriaId });
    if (!existe) {
      return res.status(404).json({ error: "La categoría indicada no existe" });
    }

    const filter = { categoria: categoriaId };
    if (q && q.trim()) {
      filter.nombreProducto = { $regex: q.trim(), $options: "i" };
    }

    const productos = await Producto.find(filter)
      .sort({ nombreProducto: 1 })
      .select("_id nombreProducto categoria codBarra lote")
      .populate("categoria", "nombre")
      .lean();

    if (format === "options") {
      const options = productos.map((p) => ({
        value: p._id,
        label: p.nombreProducto,
        categoriaId: p.categoria?._id || null,
        categoriaNombre: p.categoria?.nombre || null,
        codBarra: p.codBarra || null,
        lote: p.lote || null,
      }));
      return res.status(200).json(options);
    }

    return res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    return res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const productoEliminado = await Producto.findOneAndDelete({ _id: id });

    if (!productoEliminado) {
      return res.status(404).json({ mensaje: 'No se encontró el producto.' });
    }

    res.status(200).json({ mensaje: 'Producto eliminado con éxito.', producto: productoEliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }

}

module.exports = { crearProducto, obtenerTodosLosProductos, productosSelect ,actualizarProductoPorId, obtenerProductoPorId, obtenerCategorias, productosPorCategoria, eliminarProducto };