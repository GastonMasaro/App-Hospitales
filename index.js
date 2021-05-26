// La idea es no tener la config de la bd aca, la creacion de modelos de bd aca, sino dispersar y descentralizar
// Hacer esto de abajo, es como hacer import express from 'express';
const express = require('express');

const cors = require('cors');

// Al hacer esta instruccion, va a buscar un archivo .env y traerse las constantes definidas.
require('dotenv').config();

const { dbConnection } = require('./database/config');
// Crear el servidor de express; Esto crea e inicializa la app de express
const app = express();

// Configurar CORS. El use es conocido como un middleware, los middlerware son funciones que se van a ejecutar para todas las lineas que esten mas abajo de donde este definida.
app.use(cors());

// Lectura y parseo del Body
app.use(express.json());

// Base de datos
dbConnection();

// Directorio publico
app.use( express.static('public') )

// Rutas, podes crear una API REST con express, soporta los metodos put, get, post, delete
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/todo', require('./routes/busquedas.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));

app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto en el ${process.env.PORT}`)
});