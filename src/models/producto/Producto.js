const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombreProducto: { type: String, required: true, trim: true },
  lote: { type: Number, unique: true },
  codBarra: { type: Number, unique: true }, 
  existencia: { type: Number, default: 0 },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true }
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;