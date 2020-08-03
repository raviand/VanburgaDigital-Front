import { Component, OnInit } from '@angular/core';
import { SocialService } from 'ngx-social-button';
import { LoginService, Socialusers } from 'src/app/service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css'],
})
export class HeaderMenuComponent implements OnInit {
  constructor(
    private socialAuthService: SocialService,
    private loginService: LoginService,
    private router: Router
  ) {}
  opened = false;
  logged = false;
  user : Socialusers;
  sellerRole = false;
  managerRole = false;
  adminRole = false;
  isLogged = false

  ngOnInit(): void {
    this.logged = this.loginService.userlogged();
    this.user = this.loginService.loadUserInSession();
    setInterval( () => {
      this.isLogged =   this.socialAuthService.isSocialLoggedIn();
    }, 1000 );
  }

  signOut() {
    this.loginService.logOut();
    this.user = null
    this.router.navigate(['menu'])
  }
  
  stagesAccess(){
    return this.loginService.getUserRole()?.id > 0 
  }

  kitchenAccess(){
    return this.loginService.getUserRole() != null && this.loginService.getUserRole()?.id < 3
  }
}
