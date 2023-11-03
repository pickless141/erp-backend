const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
  },
  pedido: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    default: "PENDIENTE",
    enum: ['PENDIENTE', 'COMPLETADO', 'CANCELADO'],
  },
  fechaPedido: {
    type: Date,
    default: Date.now,
  },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;