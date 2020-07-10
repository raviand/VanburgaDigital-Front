import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/publicAccess/home/home.component';
import { MenuComponent } from './component/publicAccess/menu/menu.component';
import { ContactoComponent } from './component/publicAccess/contacto/contacto.component';
import { ClientComponent } from './component/publicAccess/client/client.component';
import { OrderSendedComponent } from './component/publicAccess/order-sended/order-sended.component';
import { OrderErrorComponent } from './component/publicAccess/order-error/order-error.component';
import { PageErrorComponent } from './component/publicAccess/page-error/page-error.component';
import { LoginComponent } from './component/privateAccess/login/login.component';
import { OrderProcessComponent } from './component/privateAccess/order-process/order-process.component';
import { RegisterUserComponent } from './component/privateAccess/register-user/register-user.component';
import { MonitorCocinaComponent } from './component/publicAccess/monitor-cocina/monitor-cocina.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'cocina', component: MonitorCocinaComponent },
  { path: 'error', component: OrderErrorComponent },
  { path: 'success', component: OrderSendedComponent },
  {
    path: 'order',
    component: ClientComponent,
    children: [
      { path: 'success', component: OrderSendedComponent },
      { path: 'error', component: OrderErrorComponent },
    ],
  },
  //Pagina de logueo
  { path: 'login', component: LoginComponent, data: { title: 'Login Page' } },
  {
    path: 'register',
    component: RegisterUserComponent,
    data: { title: 'Register Page' },
  },

  { path: 'stages', component: OrderProcessComponent },
  //{path:'searchOrder', component: SearchOrderComponent},
  //{path:'searchProduct', component: SearchProductComponent},
  //{path:'createProduct', component: CreateProductComponent},

  { path: '**', component: PageErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
