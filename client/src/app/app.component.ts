import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSICBOX';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService: UserService


  ){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  public onSubmit(){
    //conseguir los datos del usuario identificado
    this._userService.signUp(this.user).subscribe(
      response =>{

        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("El usuario no está correctamente identificado");
        }else{
          // crear elemento en localstorage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));
          //conseguir el token para enviarlo a cada petición
          this._userService.signUp(this.user, 'true' ).subscribe(
            response =>{

              let token = response.token;
              this.token = token;

              if(this.token.length <= 0){
                alert("El token no se ha generado");
              }else{
                // crear elemento en localstorage para tener el token disponible
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error =>{
              var errorMessage = <any>error;
              var body = JSON.parse(error._body);
              if(errorMessage != null){
                this.errorMessage= body.message;
                console.log(error);
              }
            }
          );
        }
      },
      error =>{
        var errorMessage = <any>error;
        var body = JSON.parse(error._body);
        if(errorMessage != null){
          this.errorMessage= body.message;
          console.log(error);
        }
      }
    );
  }

  public logOut(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
    }

  public onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(
      response =>{
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister= "Error en el registro";
        }else{
          this.alertRegister= "El registro se ha realizado correctamente! Identifícate con "+this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error =>{
        var errorMessage = <any>error;
        var body = JSON.parse(error._body);
        if(errorMessage != null){
          this.alertRegister= body.message;
          console.log(error);
        }
      }
    );
  }

}
