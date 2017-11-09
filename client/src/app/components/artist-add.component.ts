import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import {ArtistService } from '../services/artist.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'artist-add',
  templateUrl: '../views/artist-add.html',
  providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
  public titulo:string;
  public artist: Artist;
  public identity;
  public token;
  public url;
  public alertMessage;

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserService,
      private _artistService: ArtistService
  ){
    this.titulo = 'Añadir un artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist("","","");
  }

  ngOnInit(){
    console.log("ARTIST-ADD CARGADO");
  }
  onSubmit(){
    console.log(this.artist);
    this._artistService.addArtist(this.token, this.artist).subscribe(


      response =>{

        if(!response.artist){
          this.alertMessage = "ERROR EN EL SERVIDOR";
        }else{
          this.artist  = response.artist;
            this.alertMessage = "EL ARTISTA SE HA AÑADIDO CORRECTAMENTE";
            this._router.navigate(['/edit-artist/', response.artist._id]);
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
  }

}
