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
});

const Produccion = mongoose.model('Produccion', produccionSchema);

module.exports = Produccion;