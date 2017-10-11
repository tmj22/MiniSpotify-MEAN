'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');
const api = express.Router();
const md_auth = require('../middlewares/authenticate');

const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/artists'});

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getAllArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload],  ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile',  ArtistController.getImageFile);

module.exports = api;
