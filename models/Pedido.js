const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true,
  },
  pedido: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }, 
  fecha: {
    type: Date,
    default: Date.now,
  },
  // Otros campos relevantes para el pedido
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;