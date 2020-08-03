import { Component, OnInit } from '@angular/core';
import { LoginService, Socialusers } from 'src/app/service/login.service';
import { OrderService, Order, OrderResponse, KitchenStatus } from 'src/app/service/order.service';
import { Router } from '@angular/router';
import { Status } from 'src/app/app.constant';
import { Extra } from 'src/app/service/menu.service';

@Component({
  selector: 'app-monitor-cocina',
  templateUrl: './monitor-cocina.component.html',
  styleUrls: ['./monitor-cocina.component.css']
})
export class MonitorCocinaComponent implements OnInit {

  constructor(private loginService : LoginService, 
    private orderService : OrderService,
    private router : Router) { }

    time = new Date();
  user : Socialusers
  orders : Order[];
  extrasList :Extra [];
  dateFrom : Date;
  kitchenStats : KitchenStatus;
  loaded = false
  error = false


  ngOnInit(): void {
    setInterval(()=>{
      this.time = new Date()
    }, 1000);
    this.user = this.loginService.loadUserInSession()
    if(this.user == null || this.user?.role == null || this.user.role.id >  2){
      this.router.navigate(['/menu'])
    }
    this.dateFrom  = new Date();
    this.dateFrom.setDate( this.dateFrom.getDate() - 1)

    this.getKitchenInfo()
    //Se va ejecutar cada 1 min va a consultar al servicio los pedidos para la cocina
    setInterval( () => {
      
      this.getKitchenInfo()
    }, 60 * 1000 );

    this.orderService.getExtras().subscribe( (e:Extra []) => this.extrasList = e)

  }

  getKitchenInfo(){
    this.orderService.getKitchenStatus().subscribe( (ks:any) =>  {
      if( ks.kitchenStatus != null){
        this.orders = ks.kitchenStatus.orders;
        this.kitchenStats = ks.kitchenStatus;
        
        this.orders?.forEach(or => {
          or.products.forEach( prod => {
    
            prod.extras?.forEach( ex => {
              
              if(ex.id == 6){
                prod.rawMaterial += ex.quantity;
                let index = prod.extras.indexOf(ex,0)
                prod.extras.splice(index, 1)
              }
            } )
          } )
        })
      }
      this.loaded = true;
    },
      err => {
        this.error = true;
        this.loaded = true;        
      }
    )
  }

}
