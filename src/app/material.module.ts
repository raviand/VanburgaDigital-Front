import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
 @NgModule({
   imports: [MatCardModule, MatListModule, MatGridListModule],
   exports:[MatCardModule, MatListModule, MatGridListModule]
 })
 export class MaterialModule { }