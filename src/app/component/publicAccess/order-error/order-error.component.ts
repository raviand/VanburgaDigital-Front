import { Component, OnInit, Input } from '@angular/core';
import { OrderService, Client } from 'src/app/service/order.service';
import { Product } from 'src/app/service/menu.service';
import { Router } from '@angular/router';
import { HttpParameterCodec, HttpUrlEncodingCodec } from '@angular/common/http';

@Component({
  selector: 'app-order-error',
  templateUrl: './order-error.component.html',
  styleUrls: ['./order-error.component.css']
})
export class OrderErrorComponent implements OnInit {

  constructor(private orderService : OrderService, private router : Router) { }
  
  stringCart:string
  cart : Product[];
  parameterEncoding :ParameterEncoder
  @Input() client :Client

  ngOnInit(): void {
    this.parameterEncoding = new ParameterEncoder() 
    this.cart = this.orderService.loadClientCart();
    if(this.cart == null  || this.cart.length == 0){
      this.router.navigate(['home'])
    }
    this.stringCart = "Te envio mi pedido que NO pude registrar por la pagina: \n"
    this.cart.forEach(prod => {
      this.stringCart += `\n-${prod.name} - $${prod.price} \n`
      if(prod.extras?.length > 0){
        this.stringCart += `Con extras \n`
        prod.extras.forEach(ex => {
          this.stringCart += `* ${ex.name} - $${ ex.price } \n`
        })
      }
      this.stringCart += `\n-----------------------`
    })

    this.stringCart = this.parameterEncoding.encodeValue(this.stringCart)
    console.log(this.stringCart)
    //this.stringCart = 'Te+envio+mi+pedido+que+NO+pude+registrar+por+la+pagina%3A+%0D%0A%0D%0A-Cuarto+Vanburga+-+%24400+%0D%0ACon+extras+%0D%0A%2A+Extra+Cheddar+-+%2450+%0D%0A%0D%0A-----------------------%0D%0A-Cuarto+Vanburga+-+%24400+%0D%0A%0D%0A-----------------------%0D%0A-Cl%C3%A1sica+-+%24400+%0D%0ACon+extras+%0D%0A%2A+Extra+Cheddar+-+%2450+%0D%0A%2A+Extra+Bacon+-+%2450+%0D%0A%0D%0A-----------------------'
  }

}

class ParameterEncoder extends HttpUrlEncodingCodec{
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
