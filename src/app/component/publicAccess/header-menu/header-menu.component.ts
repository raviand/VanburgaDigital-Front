import { Component, OnInit } from '@angular/core';
import { SocialService } from 'ngx-social-button';
import { LoginService, Socialusers } from 'src/app/service/login.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css'],
})
export class HeaderMenuComponent implements OnInit {
  constructor(
    private socialAuthService: SocialService,
    private loginService: LoginService
  ) {}
  opened = false;
  logged = false;
  user : Socialusers;
  sellerRole = false;
  managerRole = false;
  adminRole = false;


  ngOnInit(): void {
    this.logged = this.loginService.userlogged();
    this.user = this.loginService.loadUserInSession();
    
  }

  signOut() {
    this.loginService.logOut();
    this.user = null
  }
  isLoggedIn() {
    return this.socialAuthService.isSocialLoggedIn();
  }

  stagesAccess(){
    return this.loginService.getUserRole()?.id > 0 
  }

  kitchenAccess(){
    return this.loginService.getUserRole() != null && this.loginService.getUserRole()?.id < 3
  }
}
