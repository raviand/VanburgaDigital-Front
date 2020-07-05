import { Component, OnInit } from '@angular/core';
import { SocialService } from 'ngx-social-button';
import { LoginService } from 'src/app/service/login.service';

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
  ngOnInit(): void {
    this.logged = this.loginService.userlogged();
  }

  signOut() {
    this.loginService.logOut();
  }
  isLoggedIn() {
    return this.socialAuthService.isSocialLoggedIn();
  }
}
