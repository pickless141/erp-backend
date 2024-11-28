const mongoose = require('mongoose');

const facturacionSchema = new mongoose.Schema({
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },
    tienda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tienda',
      required: true,
    },
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Producto',
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
          min: 1, 
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    IVA: {
      type: Number,
    },
    fechaFactura: {
      type: Date,
      required: true, 
    },
    fechaVencimiento: {
      type: Date,
      required: true, 
    },
    metodoPago: {
      type: String,
      enum: ['credito', 'contado'], 
      required: true,
    },
    estado: {
      type: String,
      enum: ['PENDIENTE', 'COBRADO', 'VENCIDO' ,'CANCELADO'],
      default: 'PENDIENTE',
    },
  }, {
    timestamps: true, 
  });

const Facturacion = mongoose.model('Facturacion', facturacionSchema);

module.exports = Facturacion;