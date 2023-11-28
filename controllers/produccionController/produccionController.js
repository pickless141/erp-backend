const Produccion = require('../../models/produccion/Produccion.js');
const Producto = require('../../models/producto/Producto.js');

// Controlador para registrar una producción
const registrarProduccion = async (req, res) => {
  const { nombreProducto, cantidadProducida, numeroLote,fechaVencimiento } = req.body;

  try {
    const productoExistente = await Producto.findOne({ nombreProducto });

    if (productoExistente) {
      const produccion = new Produccion({
        producto: productoExistente._id,
        cantidadProducida,
        numeroLote,
        fechaVencimiento,
      });
      await produccion.save();

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

const obtenerProducciones = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  try {
    const totalProducciones = await Produccion.countDocuments();
    const producciones = await Produccion.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('producto')
      .sort({ fechaProduccion: -1 }); 

    res.status(200).json({ producciones, totalProducciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las producciones' });
  }
};

module.exports = { registrarProduccion, obtenerProducciones };