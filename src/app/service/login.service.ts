import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URI } from 'src/app/app.constant'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  
  constructor(private http: HttpClient) { }
  logedIn = false;
  Savesresponse(user){
    this.logedIn = true;
    return this.http.post(`${API_URI}user`,user);

  }

  userlogged(){
    return this.logedIn
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
}