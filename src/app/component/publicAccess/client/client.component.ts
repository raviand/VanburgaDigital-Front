import { Component, OnInit } from '@angular/core';
import { Client, OrderService, Address, OrderRequest } from 'src/app/service/order.service';
import { Product, State, MenuService } from 'src/app/service/menu.service';
import {  FormGroup,FormControl, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { ElementSchemaRegistry } from '@angular/compiler';

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
  delivery :boolean;


  deliverForm = new FormGroup({
    name : new FormControl('', [Validators.minLength(3), Validators.maxLength(20),Validators.required]),
    lastName : new FormControl('', [Validators.min(3), Validators.max(20), Validators.required]),
    cellphone : new FormControl('', [Validators.min(3), Validators.required]),
    mail : new FormControl('', [Validators.min(3), Validators.required, Validators.email]),
    street : new FormControl(''),
    doorNumber : new FormControl(''),
    zipCode : new FormControl(''),
    floor : new FormControl(''),
    door : new FormControl(''),
    state : new FormControl('') ,
    comments : new FormControl('') 
  }
  )

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
      err => console.log(err)
    )
  }

  onSubmit(){
    // stop here if form is invalid
    if (this.deliverForm.invalid) {
      return;
    }
    console.log(this.deliverForm.value)
    this.client.address.state = this.selectedState.id
    console.log(this.client)
    this.submitted = true;
    let orderRequest : OrderRequest;
    orderRequest = new OrderRequest();
    orderRequest.client = this.client;
    orderRequest.comment = this.comment;
    orderRequest.products = this.cart;
    console.log(orderRequest)
    this.orderService.createOrder(orderRequest).subscribe(
      res => {
        console.log('All perfect! : ' + res)
        //this.orderService.saveClientCart([]);
        this.cartSended = JSON.stringify(this.cart)
        this.sended = 1;
        //this.router.navigate(['/m'])
      },
      err => {
        this.sended = -1;
        console.log(err)
      }
    )
  }

   getCurrentModel() { 
    return JSON.stringify(this.client); 
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