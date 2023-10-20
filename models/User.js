const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    nombre: {
        type: String,
        trim: true
    },
    apellido: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        unique: true,
        trim: true
    }
});

module.exports = mongoose.model('Usuarios', userSchema)