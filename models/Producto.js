const mongoose = require('mongoose');

// Definir el esquema del producto
const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  existencia: {
    type: Number,
    required: true,
    trim: true
  }
});

// Crear un modelo a partir del esquema
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;