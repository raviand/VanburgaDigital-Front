import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { MenuComponent } from './component/menu/menu.component';


const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'menu', component: MenuComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
