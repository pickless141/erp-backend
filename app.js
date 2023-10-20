const express = require('express');
const mainRoutes = require('./routes/indexRoutes')

// Crear el servidor
const app = express();

// Habilitar bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRoutes)

module.exports = app;