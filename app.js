//const crypto = require('crypto');
const express = require('express');
const cors = require('cors')
const mainRoutes = require('./src/routes/indexRoutes')

// Crear el servidor
const app = express();

const allowedOrigin = process.env.FRONTEND_URL


// Habilitar bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
      origin: allowedOrigin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Habilita las cookies y encabezados de autenticación
    })
);

app.use('/', mainRoutes)

// Genera una clave secreta aleatoria de 32 bytes (256 bits)
// const jwtSecret = crypto.randomBytes(32).toString('hex');
// console.log(jwtSecret);

module.exports = app;