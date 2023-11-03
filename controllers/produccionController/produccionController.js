const Produccion = require('../../models/produccion/Produccion.js');
const Producto = require('../../models/producto/Producto.js');

// Controlador para registrar una producción
const registrarProduccion = async (req, res) => {
  const { nombreProducto, cantidadProducida, fechaVencimiento } = req.body;

  try {
    // Busca el producto por su nombre en el modelo de Producto
    const productoExistente = await Producto.findOne({ nombreProducto });

    if (productoExistente) {
      // Registra la producción en el modelo de Produccion
      const produccion = new Produccion({
        producto: productoExistente._id,
        cantidadProducida,
        fechaVencimiento,
      });
      await produccion.save();

      // Actualiza la existencia del producto
      await Producto.findOneAndUpdate(
        { _id: productoExistente._id },
        { $inc: { existencia: cantidadProducida } }
      );

      return res.status(201).json({ mensaje: 'Producción registrada exitosamente', produccion });
    } else {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al registrar la producción' });
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