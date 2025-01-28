const mongoose = require('mongoose');

const depositoSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true
    },
    cantidad: {
        type: Number,
        default: 0
    }, 
}, {timestamps: true})

module.exports = mongoose.model('Deposito', depositoSchema);