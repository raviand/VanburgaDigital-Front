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

  user : Socialusers
  orders : Order[];
  extrasList :Extra [];
  dateFrom : Date;
  kitchenStats : KitchenStatus;
  ngOnInit(): void {
    this.user = this.loginService.loadUserInSession()
    if(this.user == null || this.user?.role == null || this.user.role.id >  2){
      this.router.navigate(['/menu'])
    }
    this.dateFrom  = new Date();
    this.dateFrom.setDate( this.dateFrom.getDate() - 1)
    this.orderService.getKitchenStatus().subscribe( (ks:any) =>  {
      console.log(ks);
      
      this.orders = ks.kitchenStatus.orders;
      this.kitchenStats = ks.kitchenStatus;
      console.log(this.kitchenStats);
      
      this.orders?.forEach(or => {
        or.products.forEach( prod => {
  
          prod.extras?.forEach( ex => {
            console.log(ex);
            
            if(ex.id == 6){
              prod.rawMaterial += ex.quantity;
              let index = prod.extras.indexOf(ex,0)
              prod.extras.splice(index, 1)
            }
          } )
        } )
      })
    })

    // this.orderService.searchOrderList(Status.KITCHEN, this.dateFrom, null, null).subscribe((or:OrderResponse) =>{
    //   this.orders = or.orders;
    //   console.log(this.orders);

      
      
    // })
    this.orderService.getExtras().subscribe( (e:Extra []) => this.extrasList = e)

    

  }

}
