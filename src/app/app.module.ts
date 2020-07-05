import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HomeComponent } from './component/publicAccess/home/home.component';
import { MenuComponent } from './component/publicAccess/menu/menu.component';
import { PageMenuComponent } from './component/publicAccess/page-menu/page-menu.component';
import { FooterComponent } from './component/publicAccess/footer/footer.component';
import { ClientComponent } from './component/publicAccess/client/client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselComponent } from './carousel/carousel.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';
import { NgxSocialButtonModule, SocialServiceConfig } from 'ngx-social-button';
import { OrderSendedComponent } from './component/publicAccess/order-sended/order-sended.component';
import { OrderErrorComponent } from './component/publicAccess/order-error/order-error.component';
import { PageErrorComponent } from './component/publicAccess/page-error/page-error.component';
import { OrderProcessComponent } from './component/privateAccess/order-process/order-process.component';
import { LoginComponent } from './component/privateAccess/login/login.component';
import { RegisterUserComponent } from './component/privateAccess/register-user/register-user.component';
import { HeaderMenuComponent } from './component/publicAccess/header-menu/header-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { ContactoComponent } from './component/publicAccess/contacto/contacto.component';
import { MonitorCocinaComponent } from './component/publicAccess/monitor-cocina/monitor-cocina.component';

// Configs
export function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
    .addFacebook('762676337832580')
    .addGoogle(
      '878640223831-n7q9a9ssp1qbdb8rtr30c7s7gvv3o97q.apps.googleusercontent.com'
    )
    .addLinkedIn('Your-LinkedIn-Client-Id');
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    PageMenuComponent,
    FooterComponent,
    ClientComponent,
    OrderSendedComponent,
    OrderErrorComponent,
    PageErrorComponent,
    OrderProcessComponent,
    LoginComponent,
    RegisterUserComponent,
    HeaderMenuComponent,
    ContactoComponent,
    MonitorCocinaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    MomentModule,
    ReactiveFormsModule,
    NgxSocialButtonModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: SocialServiceConfig,
      useFactory: getAuthServiceConfigs,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
