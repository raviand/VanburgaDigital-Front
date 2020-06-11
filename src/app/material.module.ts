import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';


 @NgModule({
   imports: [
     MatCardModule, 
     MatListModule, 
     MatGridListModule, 
     MatInputModule,
     MatExpansionModule,
     MatButtonModule,
     MatIconModule,
     MatSidenavModule
    ],
   exports:[
     MatCardModule, 
     MatListModule, 
     MatGridListModule, 
     MatInputModule,
     MatExpansionModule,
     MatButtonModule,
     MatIconModule,
     MatSidenavModule
    ]
 })
 export class MaterialModule { }