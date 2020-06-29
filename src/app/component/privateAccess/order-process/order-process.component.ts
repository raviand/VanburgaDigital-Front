import { Component, OnInit } from '@angular/core';
import { OrderService, Order } from 'src/app/service/order.service';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {

  constructor(private orderServie : OrderService) { }

  toConfirmOrders : Order[];
  confirmedOrders : Order[];
  kitchenOrders   : Order[];
  toDeliveryOrders : Order[];
  finishedOrders  : Order[];
  dateFrom : Date;
  ngOnInit(): void {
    this.dateFrom  = new Date();
    this.dateFrom.setDate( this.dateFrom.getDate() - 1)
    this.orderServie.searchOrderList(null, this.dateFrom, null, null).subscribe(
      res => {
        console.log(res)
      },
      err=>{
        console.log(err)
      }
    );

  }

}
