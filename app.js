//const crypto = require('crypto');
const express = require('express');
const mainRoutes = require('./routes/indexRoutes')

// Crear el servidor
const app = express();

// Habilitar bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRoutes)

// Genera una clave secreta aleatoria de 32 bytes (256 bits)
// const jwtSecret = crypto.randomBytes(32).toString('hex');
// console.log(jwtSecret);

module.exports = app;