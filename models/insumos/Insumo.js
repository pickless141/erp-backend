const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
  producto: String,
  peso: Number,
  descripcion: String
});

const Insumo = mongoose.model('Insumo', insumoSchema);

module.exports = Insumo;