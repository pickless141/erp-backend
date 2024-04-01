const mongoose = require('mongoose');

const tiendaSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  nombreCliente: String, 
  nombreTienda: String,
  direccion: String,
  descripcion: String,
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
      },
      precio: {
        type: Number,
        default: 0,
      },
    }
  ]
});

const Tienda = mongoose.model('Tienda', tiendaSchema);

module.exports = Tienda;