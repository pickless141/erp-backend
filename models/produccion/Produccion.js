const mongoose = require('mongoose');

const produccionSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
  },
  cantidadProducida: Number,
  fechaProduccion: {
    type: Date,
    default: Date.now,
  },
  fechaVencimiento: Date,
});

const Produccion = mongoose.model('Produccion', produccionSchema);

module.exports = Produccion;