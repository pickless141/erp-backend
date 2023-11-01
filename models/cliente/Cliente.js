const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: String, 
  email: {
    type: String,
    unique: true,
  },
  ruc: {
    type: String,
    required: true,
    unique: true,
  },
  telefono: Number,
});

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = Cliente;