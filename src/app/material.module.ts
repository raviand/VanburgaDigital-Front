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
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';


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
     MatChipsModule,
     MatTableModule,
     MatSelectModule,
     MatFormFieldModule
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
     MatChipsModule,
     MatTableModule,
     MatSelectModule,
     MatFormFieldModule
    ]
 })
 export class MaterialModule { }