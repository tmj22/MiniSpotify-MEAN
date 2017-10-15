'use strict'
const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getAlbum(req, res) {
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if (err) {
      res.status(500).send({message: 'Error en la petición'});
    } else {
      if (!album) {
        res.status(404).send({message: 'El album no existe'});
      } else {
        res.status(200).send({album});
      }
    }
  });
}

function saveAlbum(req, res) {
  var album = new Album();
  var params = req.body;

  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.artist = params.artist;
  album.image = 'null';

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({message: 'Error al guardar el álbum'});
    } else {
      if (!albumStored) {
        res.status(404).send({message: 'El álbum no ha sido guardado'});
      } else {
        res.status(200).send({album: albumStored});
      }
    }
  });
}

function getAllAlbums(req, res) {
  var artistId = req.params.artist;

  if (!artistId) {
    //sacar todos los álbumes de la base de datos
    var find = Album.find({}).sort('title');
  }else {
    //sacar los álbumes de un artista en concreto de la base de datos
    var find = Album.find({artist: artistId}).sort('year');
  }

  find.populate({path: 'artist'}).exec((err, albums)=>{
    if (err) {
      res.status(500).send({message: 'Error en la petición'});
    } else {
      if (!albums) {
        res.status(404).send({message: 'No hay álbumes'});
      } else {
        return res.status(200).send({albums});
      }
    }
  });
}

function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({
        message: 'Error al guardar el álbum'
      });
    } else {
      if (!albumUpdated) {
        res.status(404).send({
          message: 'El álbum no ha sido actualizado'
        });
      } else {
        res.status(200).send({
          album: albumUpdated
        });
      }
    }
  });
}

function deleteAlbum(req, res) {
  var albumId = req.params.id;


  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if (err) {
      res.status(500).send({
        message: 'Error al eliminar el album'
      });
    } else {
      if (!albumRemoved) {
        res.status(404).send({
          message: 'El album no ha podido ser eliminado'
        });
      } else {
        Song.find({
          album: albumRemoved._id
        }).remove((err, songRemoved) => {
          if (err) {
            res.status(500).send({message: 'Error al eliminar la canción'});
          } else {
            if (!songRemoved) {
              res.status(404).send({message: 'La canción no ha podido ser eliminada'});
            } else {
              res.status(200).send({album: albumRemoved});
            }
          }
        });
      }
    }
  });
}


function uploadImage(req, res){
  var albumId = req.params.id;
  var file_name = 'No subido...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('\\');
    var file_name = file_split[2];

    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif"  ) {
      Album.findByIdAndUpdate(albumId, {
        image: file_name
      }, (err, albumUpdated) => {
        if (!albumUpdated) {
          res.status(404).send({
            message: 'No se ha podido actualizar la imagen'
          });
        } else {
          res.status(200).send({
            album: albumUpdated
          });
        }
      });

    } else {
      res.status(200).send({
        message: 'Extensión del archivo no válida'
      });
    }

  } else {
    res.status(200).send({
      message: 'No se ha subido la imagen'
    });
  }

}

function getImageFile(req, res){
  var imageFile = req.params.imageFile;
  var path_file = './uploads/albums/'+imageFile;

  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}


module.exports = {
  getAlbum,
  saveAlbum,
  getAllAlbums,
  updateAlbum,
  deleteAlbum,
  uploadImage,
  getImageFile
};
