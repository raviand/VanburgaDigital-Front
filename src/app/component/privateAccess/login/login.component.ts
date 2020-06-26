import { Component, OnInit, Inject } from '@angular/core';
import { Socialusers, LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';
import { SocialService } from "ngx-social-button";
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage
  response;  
  socialusers=new Socialusers();  
  hide = true
  submitted = false
  shareObj = {
    href: "FACEBOOK-SHARE-LINK",
    hashtag:"#FACEBOOK-SHARE-HASGTAG"
  };

  registerForm = this.formBuilder.group({
    mail :        ['', [Validators.required]],
    password:     ['', [Validators.required]],
  })

  get f() {         return this.registerForm.controls; }
  get mail(){       return this.registerForm.get('mail')}
  get password(){     return this.registerForm.get('password')}

  constructor(  
    private socialAuthService: SocialService,  
    private SocialloginService: LoginService,  
    private router: Router, private formBuilder: FormBuilder
  ) { }  

  ngOnInit() {  
  }  

  login(){
    let user = new Socialusers()
    user.password = btoa(this.registerForm.value.password)
    user.email = this.registerForm.value.mail
    this.Savesresponse(user)
  }

  
  getSocialUser(socialUser:Socialusers){
    console.log(socialUser);
    socialUser.loginId = socialUser.id;
    socialUser.id = null;
    this.Savesresponse(socialUser)
  }

  signOut(){
    if(this.socialAuthService.isSocialLoggedIn()){
        this.socialAuthService.signOut().catch((err)=>{
          console.log(err)
        });
    }
  }

  Savesresponse(socialusers: Socialusers) {  
    this.SocialloginService.Savesresponse(socialusers).subscribe((res: any) => {  
      console.log(res);  
      this.socialusers=res;  
      this.response = res.userDetail;  
      localStorage.setItem('socialusers', JSON.stringify( this.socialusers));  
      console.log(localStorage.setItem('socialusers', JSON.stringify(this.socialusers)));  
      this.router.navigate([`/menu`]);  
    })  
  }  

}
