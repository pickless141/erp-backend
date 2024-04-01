const mongoose = require('mongoose');

const insumoSchema = new mongoose.Schema({
  producto: String,
  peso: {
    valor: Number,
    unidad: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz', 'l', 'ml'], 
      default: 'kg',
    },
  },
  descripcion: String
});

const Insumo = mongoose.model('Insumo', insumoSchema);

module.exports = Insumo;