const mongoose = require('mongoose');

const tiendaSchema = new mongoose.Schema({
  nombreCliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  direccion: String,
});

const Tienda = mongoose.model('Tienda', tiendaSchema);

module.exports = Tienda;