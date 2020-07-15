import { Component, OnInit } from '@angular/core';
import { Client, OrderService, Address, OrderRequest } from 'src/app/service/order.service';
import { Product, State, MenuService, Extra } from 'src/app/service/menu.service';
import {  FormGroup,FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { ElementSchemaRegistry } from '@angular/compiler';
import { CLIENT } from 'src/app/app.constant';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { HttpParameterCodec, HttpUrlEncodingCodec } from '@angular/common/http';

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
    this.getTotalAmount()
  }

  onSubmit(){
    // stop here if form is invalid
    if (this.deliverForm.invalid) {
      return;
    }

    
    this.submitted = true;
    let orderRequest : OrderRequest;
    orderRequest = new OrderRequest();
    orderRequest.paymentType = this.paymentTypeSelected;
    orderRequest.client = this.client;
    orderRequest.comment = this.comment;
    orderRequest.products = this.cart;
    orderRequest.products.forEach(prod =>{
      let addExtra = prod.button?.extra
      if(addExtra > 0){
        prod.extras.forEach( ex => {
          if(ex.rawMaterial > 0){
            ex.quantity += addExtra
          }
        } )
      }
    })
    orderRequest.delivery = this.delivery
    if(this.delivery){
      let hasError
      console.log(this.client);
      console.log(this.selectedState);
      
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
    console.log(orderRequest);
    
    this.orderService.createOrder(orderRequest).subscribe(
      res => {
        this.orderService.saveClientCart([]);
        this.cartSended = JSON.stringify(this.cart)
        console.log(this.cart)
        sessionStorage.setItem(CLIENT,JSON.stringify(this.client) )
        this.router.navigate(['/success'])
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
        this.stringCart = this.orderService.cartClientMessageUrl(orderRequest, false);
        this.whatsappLink = `https://wa.me/541123915925?text=${this.orderService.cartClientMessageUrl(orderRequest, false)}`
        this.extendedErrorMessage = `Envianos el pedido por Whatsapp haciendo click <a href="https://wa.me/541123915925?text=${this.stringCart}" target="_blank">Aqui!</a>` 
      }
    )
  }

  clickDelivery(){
    this.delivery = !this.delivery;
    this.getTotalAmount()
  }

  changeState(event){
    this.getTotalAmount()
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
        console.log(prod);
        
        //Se suman todos los extras que no sean ni medallones ni quesos
        prod.extras?.forEach( e => {
          console.log(e);
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
              prod.rawMaterial += e.quantity
              medallon = e
            }
          } 
        })
        //sumo los quesos
        if( cheeseSelected != null ){
          productTotal += cheeseSelected.price * cheeseSelected.quantity * (prod.rawMaterial -1)
        }
        
        //No es un producto con medallones 
        if(prod.rawMaterial == 0){
          productTotal += prod.price;
          prod.extras?.forEach( e => productTotal += e.price * e.quantity )
        }else{
          productTotal += prod.price
        }
        console.log(`product amount ${productTotal} and total amount ${ this.totalAmount }`);
        
        this.totalAmount += productTotal

      }
    );
    if(this.delivery){
        this.totalAmount += this.selectedState?.amount;
    }
    console.log(this.totalAmount);
    
  }
}

