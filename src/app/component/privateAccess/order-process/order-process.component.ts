import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService, Order, OrderResponse } from 'src/app/service/order.service';
import { Status } from 'src/app/app.constant';
import { Router } from '@angular/router';
import { LoginService, Socialusers } from 'src/app/service/login.service';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit,OnDestroy {

  constructor(private orderServie : OrderService, private router: Router, private loginService : LoginService) { }

  toConfirmOrders : Order[] = [];
  confirmedOrders : Order[];
  kitchenOrders   : Order[];
  toDeliveryOrders : Order[];
  finishedOrders  : Order[];
  cancelledOrders  : Order[];

  showDetail = false;
  orderDetail : Order;
  dateFrom : Date;
  user : Socialusers;

  pendigsNumber : number = 0;
  confirmedNumber : number = 0;
  kitchenNumber : number = 0;
  hamburgersNumber : number = 0;
  toDeliverNumber : number = 0;
  finishedNumber : number = 0;
  canceledNumber : number = 0;
  interval = 1000;

  ngOnDestroy() {
    console.log('on destroy')
    if (this.interval) {
      console.log('refreshings')
      clearInterval(this.interval);
    }
 }

  ngOnInit(): void {

    this.user = this.loginService.loadUserInSession();
    if(this.user == null){
      this.router.navigate(['/menu'])
    }

    this.orderOrdersByStatus();

  }

  orderOrdersByStatus(){
    this.toConfirmOrders = [];
    this.confirmedOrders = [];
    this.kitchenOrders   = [];
    this.toDeliveryOrders= [];
    this.finishedOrders = [];
    this.cancelledOrders = [];

    this.dateFrom  = new Date();
    this.dateFrom.setDate( this.dateFrom.getDate() - 1)
    this.orderServie.searchOrderList(null, this.dateFrom, null, null).subscribe(
      (res : OrderResponse) => {
        console.log(res)
        let orders = res.orders
        orders.forEach(element => {
          if(element.status == Status.PENDING){
            this.toConfirmOrders.push(element)
          }if(element.status ==  Status.CONFIRM){
            this.confirmedOrders.push(element)
          }if(element.status ==  Status.KITCHEN){
            this.kitchenOrders.push(element)
          }if(element.status ==  Status.DELIVER){
            this.toDeliveryOrders.push(element)
          }if(element.status ==  Status.CANCELLED){
            this.cancelledOrders.push(element)
          }if(element.status ==  Status.FINISHED){
            this.finishedOrders.push(element)
          }
        });
        this.pendigsNumber = this.toConfirmOrders.length;
        this.setsTotalRawMaterial(this.toConfirmOrders)
        this.setsTotalRawMaterial(this.confirmedOrders)
        this.hamburgersNumber = this.setsTotalRawMaterial(this.kitchenOrders)
        this.setsTotalRawMaterial(this.toDeliveryOrders)
        this.setsTotalRawMaterial(this.cancelledOrders)

        this.confirmedNumber = this.confirmedOrders.length;
        this.kitchenNumber = this.kitchenOrders.length;
        this.canceledNumber = this.cancelledOrders.length;
        this.finishedNumber = this.finishedOrders.length;
        this.toDeliverNumber = this.toDeliveryOrders.length;
      },
      err=>{
        console.log(err)
      }
    );

  }

  setsTotalRawMaterial(orders : Order[]){
    let totalMaterialBystate = 0;
    orders.forEach(o => {
      let prodRaw = 0;
      o.products.forEach( p => {
        prodRaw += p.rawMaterial
        p.extras?.forEach(e => {
          if(e.quantity > 0){
            prodRaw += (e.rawMaterial * e.quantity )
          }
          console.log(e)
          }
        )
        console.log(prodRaw);
        
      })
      o.totalRawMaterial = prodRaw;
      totalMaterialBystate += o.totalRawMaterial
      console.log(o)
    } )
    return totalMaterialBystate;
  }

  fowardStatus(order: Order){
    console.log('Actualizando estado de orden Id ' + order.id + ' del status '+order.status+ ' al estado ' + this.getNextStatus(order.status))
    this.orderServie.updateStatus(order.id, this.getNextStatus(order.status)).subscribe( (or: any) =>{

      
      this.orderOrdersByStatus();
    } )
  }

  fowardDetailStatus(){
    console.log('Actualizando estado de orden Id ' + this.orderDetail.id + ' del status '+this.orderDetail.status+ ' al estado ' + this.getNextStatus(this.orderDetail.status))
    this.orderServie.updateStatus(this.orderDetail.id, this.getNextStatus(this.orderDetail.status)).subscribe( (or: any) =>{
      this.orderDetail.confirmed = true;
      console.log(or)
      this.orderDetail.status = or.status
      console.log(this.orderDetail)
      
      this.orderOrdersByStatus();
    } )
  }

  getNextStatus(status : string){
    switch(status){
      case Status.PENDING:
        return Status.CONFIRM;
      case Status.CONFIRM:
        return Status.KITCHEN;
      case Status.KITCHEN:
        return Status.DELIVER;
      case Status.DELIVER:
        return Status.FINISHED;
      default:
        return status;
    }
  }

  getLastStatus(status : string){
    switch(status){
      case Status.CONFIRM:
        return Status.PENDING;
      case Status.KITCHEN:
        return Status.CONFIRM;
      case Status.DELIVER:
        return Status.KITCHEN;
      case Status.FINISHED:
        return Status.DELIVER;
      default:
        return status;
    }
  }

  backwardStatus(){
    console.log('Actualizando estado de orden Id ' + this.orderDetail.id + ' del status '+this.orderDetail.status+ ' al estado ' + this.getNextStatus(this.orderDetail.status))
    this.orderServie.updateStatus(this.orderDetail.id, this.getLastStatus(this.orderDetail.status)).subscribe( (or: any) =>{
      this.orderDetail.confirmed = true;
      console.log(or)
      this.orderDetail.status = or.status
      console.log(this.orderDetail)
      
      this.orderOrdersByStatus();
    } )
  }

  confirmOrder(order : Order){
    this.orderServie.updateStatus(order.id, Status.CONFIRM).subscribe( (or: any) =>{
      order.confirmed = true;
      order.status = or.status
      this.orderOrdersByStatus();
      
    } )
  }

  viewOrderDetail(p : Order){
    console.log(p)
    this.orderDetail = p
    this.showDetail = true;
    let num = 0
    //this.orderDetail.products.forEach( prod => { num += prod.rawMaterial; this.orderDetail.totalRawMaterial = num } )
    
  }

  cancelOrder(order : Order){
    console.log(`Cancelando orden ${order.id} ` )
    this.orderServie.cancelOrder(order.id, Status.CANCELLED).subscribe(res =>{
      console.log(res)
      this.orderOrdersByStatus();
    })
  }

}
