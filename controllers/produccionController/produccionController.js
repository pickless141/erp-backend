const Produccion = require('../../models/produccion/Produccion.js');
const Producto = require('../../models/producto/Producto.js');

// Controlador para registrar una producción
const registrarProduccion = async (req, res) => {
  try {
    const { productoId, cantidadProducida } = req.body;

    // Verifica si el producto existe
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(400).json({ error: `El producto con ID ${productoId} no existe` });
    }

    // Crea un nuevo registro de producción
    const nuevaProduccion = new Produccion({
      producto: productoId,
      cantidadProducida,
    });

    // Guarda la producción en la base de datos
    await nuevaProduccion.save();

    // Actualiza la existencia del producto
    producto.existencia += cantidadProducida;
    await producto.save();

    res.status(201).json({ mensaje: 'Producción registrada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la producción' });
  }
};

// Controlador para obtener todas las producciones registradas
const obtenerProducciones = async (req, res) => {
  try {
    const producciones = await Produccion.find().populate('producto');

    res.status(200).json({ producciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las producciones' });
  }
};

module.exports = { registrarProduccion, obtenerProducciones };