const mongoose = require('mongoose');

const pedidoProductoSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
});

const pedidoSchema = new mongoose.Schema({
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
    required: true,
  },
  pedido: [pedidoProductoSchema],
  total: Number,
  IVA: Number,
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