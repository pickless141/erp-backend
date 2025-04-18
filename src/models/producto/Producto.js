const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombreProducto: String,
  lote: {
    type: Number,
    unique: true
  },
  codBarra: {
    type: Number,
    unique: true
  },
  existencia: {
    type: Number,
    default: 0, 
  },
  categoria: {
    type: String,
    enum: ['Lievito', 'EatWell'],
  }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;