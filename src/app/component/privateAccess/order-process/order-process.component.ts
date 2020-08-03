import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService, Order, OrderResponse, ScheduleResponse } from 'src/app/service/order.service';
import { Status } from 'src/app/app.constant';
import { Router } from '@angular/router';
import { LoginService, Socialusers } from 'src/app/service/login.service';
import { NumberUtils } from 'src/app/utils/number.util';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { interval } from 'rxjs';
import { Extra } from 'src/app/service/menu.service';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent implements OnInit {
  
  constructor(private orderServie : OrderService, private router: Router, private loginService : LoginService) { }
  faPaperPlane = faPaperPlane
  toConfirmOrders : Order[] = [];
  confirmedOrders : Order[];
  kitchenOrders   : Order[];
  toDeliveryOrders : Order[];
  finishedOrders  : Order[];
  cancelledOrders  : Order[];
  showDetail = false;
  dateFrom : Date;
  user : Socialusers;
  orderDetail : Order;
  toConfirm : Order;
  toCancelOrder : Order;
  toConfirmOrder: Order;
  pendigsNumber : number = 0;
  confirmedNumber : number = 0;
  kitchenNumber : number = 0;
  hamburgersNumber : number = 0;
  toDeliverNumber : number = 0;
  finishedNumber : number = 0;
  canceledNumber : number = 0;
  totalOrderAmount = 0;
  deliveryTime : string [] 
  selectedDeliveryTime : string;
  loaded = false
  error = false
  scheduleResume : ScheduleResponse;


  ngOnInit(): void {

    //Seteo el combo de horario en la confirmacion
    let min = 0
    this.deliveryTime = []
    for (let index = 21; index < 26; ) {
      if(index >= 24) this.deliveryTime.push(`${NumberUtils.leftPad(index - 24, 2)}:${NumberUtils.leftPad(min, 2)}`)
      else this.deliveryTime.push(`${NumberUtils.leftPad(index, 2)}:${NumberUtils.leftPad(min, 2)}`)
      min += 20
      if (min > 40) {min = 0; index++;}
    }

    
    

    this.user = this.loginService.loadUserInSession()
    if(this.user == null || this.user?.role == null || this.user.role.id >  2){
      this.router.navigate(['/menu'])
    }

    this.orderOrdersByStatus();

  }

  orderOrdersByStatus(){

    // const source = interval(2000)  
    // source.subscribe ( () => {
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
          if(res.orders != null){
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
          }
          this.loaded = true;
        },
        err=>{
          this.error = true
          this.loaded = true;
          console.log(err)
        }
      );
      

      this.orderServie.getScheduleResume().subscribe( sch => {
        this.scheduleResume = sch;
        
      },
      err => {
        this.loaded = true;
        this.router.navigate(['/error']);
      } )
      
    // } ) 
    }
    
  totalOrder(order : Order){
    let total = 0;
    order.products.forEach( p => {
      total += p.price
      p.extras?.forEach( e => total += e.price * e.quantity )
    })
    if(order.delivery){
      total += order.client.address.state.amount;
    }
    return total
  }

  setsTotalRawMaterial(orders : Order[]){
    let totalMaterialBystate = 0;
    orders.forEach(o => {
      o.totalRawMaterial = 0  
      o.products.forEach( p => {
        let prodRaw = 0;
        if(p.rawMaterial != 0 ) {
          prodRaw = 1
          p.extras?.forEach(e => {
            if(e.rawMaterial > 0){
              prodRaw += (e.rawMaterial * e.quantity )
            }
          })
        }
        o.totalRawMaterial += prodRaw;
      })
      totalMaterialBystate += o.totalRawMaterial
    } )
    return totalMaterialBystate;
  }

  fowardStatus(order: Order){
    this.orderServie.updateStatus(order.id, this.getNextStatus(order.status), null).subscribe( (or: any) =>{

      
      this.orderOrdersByStatus();
    } )
  }

  fowardDetailStatus(){
    this.orderServie.updateStatus(this.orderDetail.id, this.getNextStatus(this.orderDetail.status), null).subscribe( (or: any) =>{
      this.orderDetail.confirmed = true;
      this.orderDetail.status = or.status
      
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
    this.orderServie.updateStatus(this.orderDetail.id, this.getLastStatus(this.orderDetail.status), null).subscribe( (or: any) =>{
      this.orderDetail.confirmed = true;
      this.orderDetail.status = or.status
      
      this.orderOrdersByStatus();
    } )
  }

  confirmOrder(order : Order){
    this.orderServie.updateStatus(order.id, Status.CONFIRM, this.selectedDeliveryTime).subscribe( (or: any) =>{
      order.confirmed = true;
      order.status = or.status
      this.orderOrdersByStatus();
      
    } )
  }

  viewConfirmOrder(or : Order){
    this.toConfirmOrder = or;
  }

  viewOrderDetail(p : Order){
    
    this.orderDetail = p
    this.showDetail = true;
    let num = 0
    this.totalOrderAmount = 0;
    this.totalOrderAmount =  this.totalOrder(p)
    //this.orderDetail.products.forEach( prod => { num += prod.rawMaterial; this.orderDetail.totalRawMaterial = num } )
    
  }

  cancelOrder(order : Order){
    this.orderServie.cancelOrder(order.id, Status.CANCELLED).subscribe(res =>{
      this.orderOrdersByStatus();
    })
  }

}
