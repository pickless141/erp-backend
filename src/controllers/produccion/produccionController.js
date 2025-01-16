const Produccion = require('../../models/produccion/Produccion.js');
const Producto = require('../../models/producto/Producto.js');

// Controlador para registrar una producción
const registrarProduccion = async (req, res) => {
  const { productoId, cantidadProducida, numeroLote, fechaVencimiento } = req.body;

  try {
    const productoExistente = await Producto.findById(productoId);

    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const produccion = new Produccion({
      producto: productoExistente._id,
      cantidadProducida,
      numeroLote,
      fechaVencimiento,
    });

    await produccion.save();

    await Producto.findByIdAndUpdate(
      productoExistente._id,
      { $inc: { existencia: cantidadProducida } }
    );

    return res.status(201).json({ mensaje: 'Producción registrada exitosamente', produccion });
  } catch (error) {
    console.error('Error al registrar la producción:', error);
    return res.status(500).json({ error: 'Error al registrar la producción' });
  }
};

const obtenerProducciones = async (req, res) => {
  try {
    const { page = 1, search = '', limit = 10 } = req.query; 
    const skip = (page - 1) * limit;

    const filtro = search
      ? { $or: [{ nombre: { $regex: search, $options: 'i' } }] }
      : {};

    const docs = await Produccion.find(filtro).skip(skip).limit(Number(limit)).populate('producto'); 
    const totalDocs = await Produccion.countDocuments(filtro);

    res.status(200).json({ docs, totalDocs, limit: Number(limit) });
  } catch (error) {
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