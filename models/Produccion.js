const mongoose = require('mongoose');

// Definir el esquema de producción
const produccionSchema = new mongoose.Schema({
  productoProducido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto', // Hace referencia al modelo de productos
    required: true,
  },
  fechaProduccion: {
    type: Date,
    required: true,
  },
  cantidadProducida: {
    type: Number,
    required: true,
  },
});

// Crear un modelo a partir del esquema
const Produccion = mongoose.model('Produccion', produccionSchema);

module.exports = Produccion;