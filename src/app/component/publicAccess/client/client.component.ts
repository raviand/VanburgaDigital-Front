import { Component, OnInit } from '@angular/core';
import { Client, OrderService, Address, OrderRequest } from 'src/app/service/order.service';
import { Product, State, MenuService } from 'src/app/service/menu.service';
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
  parameterEncoding :ParameterEncoder
  extraError = false;
  extendedErrorMessage : string;


  deliverForm =   new FormGroup({
    name        : new FormControl('', [Validators.minLength(3), Validators.maxLength(20),Validators.required]),
    lastName    : new FormControl('', [Validators.min(3), Validators.max(20), Validators.required]),
    cellphone   : new FormControl('', [Validators.min(3), Validators.required]),
    mail        : new FormControl('', [Validators.min(3), Validators.required, Validators.email]),
    street      : new FormControl(''),
    doorNumber  : new FormControl(''),
    zipCode     : new FormControl(''),
    floor       : new FormControl(''),
    door        : new FormControl(''),
    state       : new FormControl('') ,
    comments    : new FormControl('') 
  })

  get name(){       return this.deliverForm.get('name')}
  get lastName(){   return this.deliverForm.get('lastName')}
  get cellphone(){  return this.deliverForm.get('cellphone')}
  get mail(){       return this.deliverForm.get('mail')}
  get street(){     return this.deliverForm.get('street')}
  get doorNumber(){ return this.deliverForm.get('doorNumber')}
  get zipCode(){    return this.deliverForm.get('zipCode')}
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
    orderRequest.client = this.client;
    orderRequest.comment = this.comment;
    orderRequest.products = this.cart;
    orderRequest.products.forEach(prod =>{
      let addExtra = prod.button.extra
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
      if(this.client.address?.state == null) hasError = true; 
      if(this.client.address?.street == null) hasError = true;
      if(this.client.address?.doorNumber == null) hasError = true;
      if(this.client.address?.zipCode == null) hasError = true;
      if(hasError){
        this.hasError = true;
        this.errorMessage = 'Debe completar los datos de la direccion si desea que le enviemos el pedido'
        return;
      }
      this.client.address.state = this.selectedState.id
    }else{
      orderRequest.client.address = null
    }

    this.orderService.createOrder(orderRequest).subscribe(
      res => {
        this.orderService.saveClientCart([]);
        this.cartSended = JSON.stringify(this.cart)
        console.log(this.cartSended)
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
        this.stringCart = this.parameterEncoding.encodeValue(this.stringCart)
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
        this.totalAmount += prod.price
        prod.extras?.forEach( ex => this.totalAmount += (ex.price * ex.quantity))
      }
    )
    if(this.delivery){
        this.totalAmount += this.selectedState?.amount;
    }
  }


}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
          this.sended = 1;
      } else {
          matchingControl.setErrors(null);
          this.sended = -1;
      }
  }
}

export class ParameterEncoder extends HttpUrlEncodingCodec{
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