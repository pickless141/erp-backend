const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: String,
  ruc: {
    type: String,
    required: true,
    unique: true,
  },
  telefono: Number,
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;