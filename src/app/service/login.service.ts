import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URI } from 'src/app/app.constant'
import { SocialService } from 'ngx-social-button';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  
  constructor(private http: HttpClient,private socialAuthService : SocialService) { }
  logedIn = false;
  Savesresponse(user){
    this.logedIn = true;
    return this.http.post(`${API_URI}user`,user);

  }

  userlogged(){
    return localStorage.getItem('socialusers') != null
  }

  logOut(){
    if(this.socialAuthService.isSocialLoggedIn()){
      this.socialAuthService.signOut().catch((err)=>{
        console.log(err)
      });
    localStorage.setItem('socialusers', null)
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

}