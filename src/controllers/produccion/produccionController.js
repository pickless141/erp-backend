const Produccion = require('../../models/produccion/Produccion.js');
const Producto = require('../../models/producto/Producto.js');
const Deposito = require('../../models/deposito/Deposito.js')

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

    const deposito = await Deposito.findOne({ producto: productoExistente._id });

    if (deposito) {
      deposito.cantidad = Number(deposito.cantidad) + Number(cantidadProducida);
      await deposito.save();
    } else {
      const nuevoDeposito = new Deposito({
        producto: productoExistente._id,
        cantidad: Number(cantidadProducida),
      });
      await nuevoDeposito.save();
    }

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

    const docs = await Produccion.find(filtro)
      .sort({fechaProduccion: -1})
      .skip(skip)
      .limit(Number(limit))
      .populate('producto');
    const totalDocs = await Produccion.countDocuments(filtro);

    res.status(200).json({ docs, totalDocs, limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las producciones' });
  }
};

const obtenerProductosDeposito = async (req, res) => {
  try {
    const productosDeposito = await Deposito.find().populate('producto', 'nombreProducto')
    res.status(200).json({productosDeposito})
  } catch (error) {
    console.error("Error al obtener el estado del deposito:", error)
    res.status(500).json({error: 'Error al obtener los producto del deposito'})
  }
}

const editarCantidadDeposito = async (req, res) => {
  try {
    const { id } = req.params;
    const {cantidad} = req.body;

    if (typeof cantidad !== 'number' || cantidad < 0) {
      return res.status(400).json({error: 'La cantidad debe ser un numero mayor a 0'})
    }

    const depositoActualizado = await Deposito.findByIdAndUpdate(
      id,
      { cantidad },
      { new: true } 
    );

    if (!depositoActualizado) {
      return res.status(404).json({ error: 'Depósito no encontrado' });
    }

    res.status(200).json({
      mensaje: 'Cantidad actualizada exitosamente',
      deposito: depositoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar la cantidad en el depósito:', error);
    res.status(500).json({ error: 'Error al actualizar la cantidad en el depósito' });
  }
}

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

module.exports = { registrarProduccion, obtenerProducciones, obtenerProductosDeposito, editarCantidadDeposito, eliminarProduccion };