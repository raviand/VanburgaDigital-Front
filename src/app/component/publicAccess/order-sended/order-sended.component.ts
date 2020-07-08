import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/service/menu.service';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-order-sended',
  templateUrl: './order-sended.component.html',
  styleUrls: ['./order-sended.component.css']
})
export class OrderSendedComponent implements OnInit {

  constructor(private service:OrderService) { }

  
  cart : Product[]
  whatsappLink:string
  ngOnInit(): void  {
    this.cart = this.service.loadClientCart()
  }

}
