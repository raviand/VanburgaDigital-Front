import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MenuService, Extra, Product } from 'src/app/service/menu.service';

@Component({
  selector: 'app-dialog-extra',
  templateUrl: './dialog-extra.component.html',
  styleUrls: ['./dialog-extra.component.css']
})
export class DialogExtraComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogExtraComponent>, private menuService : MenuService,
    @Inject(MAT_DIALOG_DATA) public cart: Product[]) {}
  ngOnInit(): void {
    console.log(this.cart)
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

 
}
