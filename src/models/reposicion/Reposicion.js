const mongoose = require('mongoose');

const reposicionSchema = new mongoose.Schema({
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
      },
      cantidadExhibida: {
        type: Number,
      },
      deposito: {
        type: Number,
      },
      sugerido: {
        type: Number,
        trim: true,
      },
      vencidos: {
        type: Number,
        trim: true,
      },
    },
  ],
  fechaReposicion: {
    type: Date,
    default: Date.now,
  },
});

const Reposicion = mongoose.model('Reposicion', reposicionSchema);

module.exports = Reposicion;