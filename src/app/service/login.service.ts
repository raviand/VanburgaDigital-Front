import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URI, USER } from 'src/app/app.constant'
import { SocialService } from 'ngx-social-button';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  
  constructor(private http: HttpClient,private socialAuthService : SocialService) { }
  logedIn = false;

  idUserRole : number = 0;
  userLogged : Socialusers;
  Savesresponse(user){
    this.logedIn = true;
    return this.http.post(`${API_URI}user`,user);

  }

  userlogged(){
    return localStorage.getItem(USER) != null
  }

  logOut(){
    if(this.socialAuthService.isSocialLoggedIn()){
      this.socialAuthService.signOut().catch((err)=>{
        console.log(err)
      });
      localStorage.setItem(USER, null)
      this.userLogged = null;
    }
  }
  
  saveUserInSession(user : Socialusers): void{
    this.userLogged = user;
    localStorage.setItem(USER, JSON.stringify(user))
  }

  loadUserInSession(): Socialusers{

    if(localStorage.getItem(USER) != null){
      this.userLogged = JSON.parse(localStorage.getItem(USER));
      if(this.userLogged?.role != null){
        this.idUserRole = this.userLogged.role.id
      }
    }
    return this.userLogged
  }

  getUserRole(): Role{
    this.userLogged = this.loadUserInSession()
    if(this.userLogged?.role != null){
      return this.userLogged.role;
    }
  }
}

export class Socialusers {  
  provider: string;  
  id: string;  
  loginId : String;
  email: string;  
  name: string;  
  image: string;  
  token?: string;  
  idToken?: string;
  password?: string;  
  phone?: string;  
  role?: Role;
}

export class Role {
  id : number;
  role : string;
}
