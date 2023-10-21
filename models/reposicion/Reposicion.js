const mongoose = require('mongoose');

const reposicionSchema = new mongoose.Schema({
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
  },
  existenciaAnterior: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
      },
      cantidad: Number,
    },
  ],
  existenciaActual: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
      },
      cantidad: Number,
    },
  ],
  fechaReposicion: {
    type: Date,
    default: Date.now,
  },
});

const Reposicion = mongoose.model('Reposicion', reposicionSchema);

module.exports = Reposicion;