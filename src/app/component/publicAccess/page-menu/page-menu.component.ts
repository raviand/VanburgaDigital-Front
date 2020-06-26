import { Component, OnInit } from '@angular/core';
import { SocialService } from 'ngx-social-button';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-page-menu',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.css']
})
export class PageMenuComponent implements OnInit {

  constructor(private socialAuthService : SocialService, private loginService : LoginService) { }
  opened = false
  logged = false;
  ngOnInit(): void {
    this.logged = this.loginService.userlogged();
  }

  signOut(){
    if(this.socialAuthService.isSocialLoggedIn()){
        this.socialAuthService.signOut().catch((err)=>{
          console.log(err)
        });
    }
  }
  isLoggedIn(){
    return this.socialAuthService.isSocialLoggedIn()
  }
}
