const mongoose = require('mongoose');

//modelo para registrar tiendas
const tiendaSchema = new mongoose.Schema({
  nombreCliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  nombreTienda: String,
  direccion: String,
  descripcion: String,
});

const Tienda = mongoose.model('Tienda', tiendaSchema);

module.exports = Tienda;