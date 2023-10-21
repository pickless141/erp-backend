const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  existencia: Number,
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;