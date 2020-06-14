import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatChipsModule} from '@angular/material/chips';


 @NgModule({
   imports: [
     MatCardModule, 
     MatListModule, 
     MatGridListModule, 
     MatInputModule,
     MatExpansionModule,
     MatButtonModule,
     MatIconModule,
     MatSidenavModule,
     MatDialogModule,
     MatCheckboxModule,
     MatSnackBarModule,
     MatChipsModule
    ],
   exports:[
     MatCardModule, 
     MatListModule, 
     MatGridListModule, 
     MatInputModule,
     MatExpansionModule,
     MatButtonModule,
     MatIconModule,
     MatSidenavModule,
     MatDialogModule,
     MatCheckboxModule,
     MatSnackBarModule,
     MatChipsModule
    ]
 })
 export class MaterialModule { }