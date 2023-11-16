const mongoose = require('mongoose');

const reposicionSchema = new mongoose.Schema({
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
  },
  existenciaAnterior: {
    type: Array,
    required: true
  },
  existenciaActual: {
    type: Array,
    required: true
  },
  numeroLote: {
    type: Array,
  },
  fechaReposicion: {
    type: Date,
    default: Date.now,
  },
});

const Reposicion = mongoose.model('Reposicion', reposicionSchema);

module.exports = Reposicion;