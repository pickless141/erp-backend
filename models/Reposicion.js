const mongoose = require('mongoose');

// Define el esquema de reposición
const reposicionSchema = new mongoose.Schema({
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto', // Hace referencia al modelo de Producto
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  cantidadAnterior: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto', // Hace referencia al modelo de Producto
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  fechaReposicion: {
    type: Date,
    required: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente', // Hace referencia al modelo de Cliente
    required: true,
  },
});

// Crear un modelo a partir del esquema
const Reposicion = mongoose.model('Reposicion', reposicionSchema);

module.exports = Reposicion;