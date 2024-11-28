const Producto = require('../../models/producto/Producto');

// Controlador para crear un nuevo producto
const crearProducto = async (req, res) => {
  const { nombreProducto,lote, codBarra } = req.body;

  try {
    const nuevoProducto = new Producto({
      nombreProducto,
      lote,
      codBarra
    });
    nuevoProducto.existencia = 0;

    await nuevoProducto.save();

    res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear un nuevo producto' });
  }
};

// Controlador para obtener todos los productos
const obtenerTodosLosProductos = async (req, res) => {
  try {
    const productos = req.filtrarProductos; 
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todos los productos' });
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
//Controlador para actualizar 
const actualizarProductoPorId = async (req, res) => {
  const productoId = req.params.id;
  const { nombreProducto, lote, existencia, codBarra } = req.body;

  try {
    const productoExistente = await Producto.findById(productoId);

    if (!productoExistente) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    const producto = await Producto.findOneAndUpdate(
      { _id: productoId },
      { nombreProducto, lote, existencia,codBarra },
      { new: true }
    );

    if (!producto) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    res.status(200).json({ mensaje: 'Producto actualizado exitosamente', producto });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
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

module.exports = { crearProducto, obtenerTodosLosProductos ,actualizarProductoPorId, obtenerProductoPorId, eliminarProducto };