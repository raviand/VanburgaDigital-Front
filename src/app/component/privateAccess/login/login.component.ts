import { Component, OnInit, Inject } from '@angular/core';
import { Socialusers, LoginService } from 'src/app/service/login.service';
import { Router } from '@angular/router';
import { SocialService } from "ngx-social-button";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage
  response;  
  socialusers=new Socialusers();  
  
  shareObj = {
    href: "FACEBOOK-SHARE-LINK",
    hashtag:"#FACEBOOK-SHARE-HASGTAG"
  };

  constructor(  
    private socialAuthService: SocialService,  
    private SocialloginService: LoginService,  
    private router: Router,
  ) { }  
  ngOnInit() {  
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
