const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  tienda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tienda',
  },
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
      },
      cantidad: Number,
    },
  ],
  precioTotal: Number,
  fechaPedido: {
    type: Date,
    default: Date.now,
  },
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;