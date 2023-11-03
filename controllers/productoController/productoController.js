const Producto = require('../../models/producto/Producto.js');

// Controlador para crear un nuevo producto
const crearProducto = async (req, res) => {
  const { nombreProducto, precio } = req.body;

  try {
    const nuevoProducto = new Producto({
      nombreProducto,
      precio,
    });

    // Establece la existencia en cero por defecto
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
    const productos = await Producto.find(); // Consultar todos los productos

    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todos los productos' });
  }
};

// Controlador para actualizar un producto por su ID
const actualizarProductoPorId = async (req, res) => {
  const productoId = req.params.id;
  const { nombreProducto, existencia, precio } = req.body;

  try {
    const producto = await Producto.findOneAndUpdate(
      { _id: productoId },
      { nombreProducto, existencia, precio },
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

module.exports = { crearProducto, obtenerTodosLosProductos, actualizarProductoPorId };