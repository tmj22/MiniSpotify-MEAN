'use strict'

//cargamos express y el controlador de usuario
var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

var api = express.Router();
//ruta y método a cargar
api.get('/probando-controlador',md_auth.ensureAuth , UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload],  UserController.uploadImage);
api.get('/get-image-user/:imageFile',  UserController.getImageFile);

module.exports = api;
