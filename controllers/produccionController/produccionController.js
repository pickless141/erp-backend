const Produccion = require('../../models/Produccion.js');

// Controlador para crear una nueva producción
const crearProduccion = async (req, res) => {
  const { productoProducido, fechaProduccion, cantidadProducida } = req.body;

  try {
    const nuevaProduccion = new Produccion({
      productoProducido,
      fechaProduccion,
      cantidadProducida,
    });

    await nuevaProduccion.save();

    res.status(201).json(nuevaProduccion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear una nueva producción' });
    console.log(error)
  }
};

// Controlador para obtener todas las producciones
const obtenerTodasLasProducciones = async (req, res) => {
  try {
    const producciones = await Produccion.find().populate('productoProducido'); // Consultar todas las producciones y populando el producto asociado

    res.status(200).json(producciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todas las producciones' });
  }
};

module.exports = { crearProduccion, obtenerTodasLasProducciones };