import { Component, OnInit } from '@angular/core';
import { Client, OrderService, Address, OrderRequest, Order } from 'src/app/service/order.service';
import { Product, State, MenuService, Extra } from 'src/app/service/menu.service';
import {  FormGroup,FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { CLIENT } from 'src/app/app.constant';

@Component({
  selector: 'app-client',
  inputs: ['cart'],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {


  client : Client
  constructor( private orderService : OrderService, private menuService : MenuService,
    private router : Router, ) { }
  cart: Product[] = [];
  cartSended : string;
  submitted = false
  states : State[]
  selectedState : State; 
  comment : string;
  sended : number = 0;
  delivery :boolean = false;
  totalAmount : number = 0;
  hasError = false;
  errorMessage = '';
  stringCart : string;
  whatsappLink : string
  extraError = false;
  extendedErrorMessage : string;
  paymentsTypes = ['Efectivo', 'Mercado Pago']
  paymentTypeSelected : string;
  orderDetail :OrderRequest;
  showDetail = false;
  productsToShow : Product [];

  deliverForm =   new FormGroup({
    name        : new FormControl('', [Validators.minLength(3), Validators.maxLength(20),Validators.required]),
    lastName    : new FormControl('', [Validators.min(3), Validators.max(20), Validators.required]),
    cellphone   : new FormControl('', [Validators.min(3), Validators.required]),
    mail        : new FormControl('', [Validators.min(3), Validators.required, Validators.email]),
    street      : new FormControl(''),
    doorNumber  : new FormControl(''),
    reference   : new FormControl(''),
    floor       : new FormControl(''),
    door        : new FormControl(''),
    state       : new FormControl('') ,
    comments    : new FormControl(''),
    paymentType : new FormControl('', Validators.required) 
  })

  get name(){       return this.deliverForm.get('name')}
  get lastName(){   return this.deliverForm.get('lastName')}
  get cellphone(){  return this.deliverForm.get('cellphone')}
  get mail(){       return this.deliverForm.get('mail')}
  get street(){     return this.deliverForm.get('street')}
  get doorNumber(){ return this.deliverForm.get('doorNumber')}
  get reference(){  return this.deliverForm.get('reference')}
  get floor(){      return this.deliverForm.get('floor')}
  get door(){       return this.deliverForm.get('door')}
  get comments(){   return this.deliverForm.get('comments')}

  ngOnInit(): void {
    this.selectedState = new State()
    this.client = new Client()
    this.client.address = new Address()
    this.cart = this.orderService.loadClientCart();
    
    if(this.cart == null || this.cart.length == 0){
      this.router.navigate(['/menu'])
    }

    this.menuService.getStates().subscribe(
      (res:State[] ) => this.states = res,
      err => {
        this.hasError = true;
        this.errorMessage = "No tenemos comunicacion con el servicio."
      }
    )
    //this.getTotalAmount()
  }

  confirmOrder(){
    this.submitted = true;
    
    //Paso el tipo de hamburguesa (simple, doble, etc) como extra en el pedido
    this.orderDetail.products.forEach(p=>{

      if(p.button != null){
        
        if(p.extras != null){
          let found = false
          p.extras.forEach(e=> {
            if(e.rawMaterial > 0){
              found = true
              e.quantity += p.button.extra
            }
          })
          if(!found && p.button.extra > 0){
            let extra : Extra = p.button.item
            extra.quantity = p.button.extra
            p.extras.push(extra);
          }

        }else if(p.button.extra > 0){

          p.extras = []
          p.extras.push(p.button.item)
          p.extras[0].quantity = p.button.extra

        }


      }

    })
    

    this.orderService.createOrder(this.orderDetail).subscribe(
      (res:any) => {
        this.orderService.saveClientCart([]);
        this.cartSended = JSON.stringify(this.cart)
        sessionStorage.setItem(CLIENT,JSON.stringify(this.client) )
        this.router.navigate(['/success', res.order.whatsappLink])
      },
      err => {
        this.hasError = true;
        this.extraError = true;
        this.errorMessage = 'No se pudo enviar tu pedido a Vanburga :( \nEnvianos el pedido por Whatsapp!!'
        this.stringCart = "Te envio mi pedido que NO pude registrar por la pagina: \n"
        this.cart.forEach(prod => {
          this.stringCart += `\n-${prod.name} - $${prod.price} \n`
          if(prod.extras?.length > 0){
            this.stringCart += `Con extras \n`
            prod.extras.forEach(ex => {
              this.stringCart += `* ${ex.name} X ${ex.quantity} - $${ ex.price } \n`
            })
          }
          this.stringCart += `\n-----------------------`
        })
        this.stringCart = this.orderService.cartClientMessageUrl(this.orderDetail, false);
        this.whatsappLink = this.orderService.cartClientMessageUrl(this.orderDetail, false)
        this.extendedErrorMessage = `Envianos el pedido por Whatsapp haciendo click <a href="https://wa.me/541123915925?text=${this.stringCart}" target="_blank">Aqui!</a>` 
      }
    )
  }

  clickDelivery(){
    this.delivery = !this.delivery;
    //this.getTotalAmount()
  }

  changeState(event){
   // this.getTotalAmount()
  }

  getCurrentModel() { 
    return JSON.stringify(this.client); 
  }

  getTotalAmount(){
    this.totalAmount = 0
    
    this.cart.forEach(
      prod => {
        let productTotal = 0
        let cheeseSelected : Extra;
        let medallon;
        let raw   = 0 
        
        //Se suman todos los extras que no sean ni medallones ni quesos
        prod.extras?.forEach( e => {
          if(e.quantity != 0){

            if(e.id != 1 && e.id != 20 && e.rawMaterial == 0){   
              //No hay quesos ni medallones
              productTotal += (e.price * e.quantity)
            } else if(e.rawMaterial == 0){
              //Guardo el queso en una variable
              cheeseSelected = e
            }            
            if(e.rawMaterial > 0){
              //Sumo los extra medallones
              productTotal += ( e.price * e.quantity )
              raw = e.quantity + prod.rawMaterial
              medallon = e
            }
          } 
        })
        //sumo los quesos
        if( cheeseSelected != null ){
          productTotal += cheeseSelected.price * cheeseSelected.quantity * (raw -1)
        }
        
        //No es un producto con medallones 
        if(prod.rawMaterial == 0){
          productTotal += prod.price;
          prod.extras?.forEach( e => productTotal += e.price * e.quantity )
        }else{
          productTotal += prod.price
        }
        
        this.totalAmount += productTotal

      }
    );
    if(this.delivery){
      
        this.totalAmount += this.selectedState?.amount;
    }
    
  }

  viewOrderDetail(){
    let orderRequest : OrderRequest;
    orderRequest = new OrderRequest();
    orderRequest.paymentType = this.paymentTypeSelected;
    orderRequest.client = this.client;
    orderRequest.comment = this.comment;
    orderRequest.products = this.cart;
    this.productsToShow = []
    orderRequest.products.forEach(prod =>{
      this.productsToShow.push(prod);
      let addExtra = prod.button?.extra
      let raw = 0

      prod.extras?.forEach( ex => {
        if(ex.rawMaterial > 0){
          ex.quantity += addExtra
          raw = ex.quantity
        }
      } )
      

      prod.extras?.forEach(e => {
        if(e.id == 1 || e.id == 20){
          e.quantity = raw + 1
        }
      })
    })
    this.formatProductsToShow()
    orderRequest.delivery = this.delivery
    if(this.delivery){
      let hasError      
      if(this.selectedState == null) hasError = true; 
      if(this.client.address?.street == null) hasError = true;
      if(this.client.address?.doorNumber == null) hasError = true;
      if(this.client.address?.reference == null) hasError = true;
      if(hasError){
        this.hasError = true;
        this.errorMessage = 'Debe completar los datos de la direccion si desea que le enviemos el pedido'
        return;
      }
      this.client.address.state = this.selectedState
    }else{
      orderRequest.client.address = null
    }
    this.getTotalAmount()
    this.orderDetail = orderRequest
    this.showDetail = true;
  }

  formatProductsToShow(){
    this.productsToShow.forEach(p => {

      let type = p.button;
      let extras : Extra[] = [];
      //descuento la cantidad en base a los extra medallones
      p.extras.forEach(e=>{
        if(e.rawMaterial > 0){
          e.quantity = e.quantity - type.extra
          if(e.quantity == 0){
            extras.push(e);
          }
        }
      })
      //Elimino el registro si esta en cero
      extras?.forEach(ex=>{
        let index = p.extras.indexOf(ex, 0);
        p.extras.splice(index, 1);
      })
    })
  }
}

