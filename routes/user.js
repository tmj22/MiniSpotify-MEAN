'use strict'

//cargamos express y el controlador de usuario
var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
//ruta y método a cargar
api.get('/probando-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);

module.exports = api;
