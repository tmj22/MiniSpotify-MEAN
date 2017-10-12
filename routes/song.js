'use strict'

const express = require('express');
const SongController = require('../controllers/song');
const api = express.Router();
const md_auth = require('../middlewares/authenticate');

const multipart = require('connect-multiparty');
const md_upload = multipart({uploadDir: './uploads/songs'});

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getAllSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-song-file/:id',[md_auth.ensureAuth, md_upload],  SongController.uploadFile);
api.get('/get-song-file/:songFile',  SongController.getSongFile);


module.exports = api;
