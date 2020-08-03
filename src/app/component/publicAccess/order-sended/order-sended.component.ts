import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/service/menu.service';
import { OrderService } from 'src/app/service/order.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-sended',
  templateUrl: './order-sended.component.html',
  styleUrls: ['./order-sended.component.css']
})
export class OrderSendedComponent implements OnInit {

  constructor(private service:OrderService, private route: ActivatedRoute) { }

  
  cart : Product[]
  whatsappLink:string
  ngOnInit(): void  {
    this.cart = this.service.loadClientCart()
    this.whatsappLink  = this.route.snapshot.paramMap.get('msg')
    
  }

}
