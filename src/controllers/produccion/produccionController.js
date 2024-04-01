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

const eliminarProduccion = async (req, res) => {
  const {id} = req.params
  try {
    const produccionEliminada = await Produccion.findOneAndDelete({ _id: id });

    if (!produccionEliminada) {
      return res.status(404).json({ mensaje: 'No se encontró la produccion' });
    }

    res.status(200).json({ mensaje: 'Produccion eliminada con éxito.', produccion: produccionEliminada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la produccion' });
  }

}

module.exports = { registrarProduccion, obtenerProducciones, eliminarProduccion };