const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  empresa: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  ruc: {
    type: Number,
    required: true,
    unique: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    type: Number,
    required: true,
  }
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;