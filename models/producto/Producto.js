const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombreProducto: String,
  precio: Number,
  existencia: {
    type: Number,
    default: 0, 
  },
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;