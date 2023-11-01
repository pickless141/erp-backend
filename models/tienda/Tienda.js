const mongoose = require('mongoose');

const tiendaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente', // Referencia al modelo Cliente
  },
  nombreCliente: String, 
  nombreTienda: String,
  direccion: String,
  descripcion: String,
});

const Tienda = mongoose.model('Tienda', tiendaSchema);

module.exports = Tienda;