'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
  number: Number,
  title: String,
  length: String,
  file: String,
  album: { type: Schema.ObjectId, ref: 'Album'}
});


module.export = mongoose.model('Song', SongSchema);
