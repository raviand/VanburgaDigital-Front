import { Component, OnInit } from '@angular/core';
import { Client, OrderService, Address, OrderRequest } from 'src/app/service/order.service';
import { Product, State, MenuService } from 'src/app/service/menu.service';
import {  FormGroup,FormControl, Validators  } from '@angular/forms';

@Component({
  selector: 'app-client',
  inputs: ['cart'],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  client : Client
  constructor( private orderService : OrderService, private menuService : MenuService ) { }
  cart: Product[] = [];
  submitted = false
  states : State[]
  selectedState : State; 
  comment : string;

  deliverForm = new FormGroup({
    name : new FormControl('', [Validators.min(3), Validators.max(20),Validators.required]),
    lastName : new FormControl('', [Validators.min(3), Validators.max(20), Validators.required]),
    cellphone : new FormControl('', [Validators.min(3), Validators.required]),
    mail : new FormControl('', [Validators.min(3), Validators.required, Validators.email]),
    street : new FormControl('', [Validators.required]),
    doorNumber : new FormControl('', Validators.required),
    zipCode : new FormControl('', Validators.required),
    floor : new FormControl('', Validators.required),
    door : new FormControl('', Validators.required),
    state : new FormControl('', Validators.required) ,
    comments : new FormControl('', Validators.required) 
  }
  )

  ngOnInit(): void {
    this.selectedState = new State()
    this.client = new Client()
    this.client.address = new Address()
    this.cart = this.orderService.loadClientCart();
    console.log(this.cart)
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
      },
      err => {
        console.log("there was an error " + err)
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
      } else {
          matchingControl.setErrors(null);
      }
  }
}