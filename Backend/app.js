const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const booksRoutes = require('./routes/books');

const app = express();

// Charger les variables d'environnement à partir de .env
dotenv.config();
// Utiliser la variable d'environnement pour la connexion MongoDB
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json())

app.use('/api/books', booksRoutes)


module.exports = app;
