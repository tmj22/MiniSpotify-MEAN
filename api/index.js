'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean', (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log("La base de datos funciona correctamente");

    app.listen(port, function() {
      console.log("Servidor del api rest de música escuchando en http://localhost:" + port);
    });
  }
});
