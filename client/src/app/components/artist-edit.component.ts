import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import {ArtistService } from '../services/artist.service';
import {UploadService } from '../services/upload.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'artist-edit',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
  public titulo:string;
  public artist: Artist;
  public identity;
  public token;
  public url;
  public alertMessage;
  public is_edit;

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserService,
      private _artistService: ArtistService,
      private _uploadService: UploadService
  ){
    this.titulo = 'Editar artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist("","","");
    this.is_edit = true;
  }

  ngOnInit(){
    console.log("ARTIST-EDIT CARGADO");
    this.getArtist();
  }

  getArtist(){
    this._route.params.forEach((params: Params) =>{
      let id = params['id'];
      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          if(!response.artist){
            this._router.navigate(['/']);
          }else{
            this.artist = response.artist;
          }
        },

        error =>{
          var errorMessage = <any>error;

          if(errorMessage != null){
            var body = JSON.parse(error._body);
            //this.alertMessage= body.message;
            console.log(error);
        }
      }
      );

    });
  }

  onSubmit(){
    this._route.params.forEach((params: Params) =>{
    let id = params['id'];
    console.log(this.artist);
        this._artistService.editArtist(this.token, id, this.artist).subscribe(
          response =>{

            if(!response.artist){
              this.alertMessage = "ERROR EN EL SERVIDOR";
            }else{
              //this.artist  = response.artist;
                this.alertMessage = "EL ARTISTA SE HA ACTUALIZADO CORRECTAMENTE";
              //this._router.navigate(['/edit-artist'], response.artist.id);
              //subir la imagen de ARTISTA
              this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+ id, [], this.filesToUpload, this.token, 'image').then(

                  (result) => {
                    this._router.navigate(['/artists/1']);
                  },
                  (error)=> {
                    console.log(error);
                  }


              );
            }
          },
          error =>{
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.alertMessage= body.message;
              console.log(error);
          }
        }

        );
  });
  }

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}
