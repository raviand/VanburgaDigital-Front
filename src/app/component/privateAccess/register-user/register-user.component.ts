import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Client } from 'src/app/service/order.service';
import { Socialusers } from 'src/app/service/login.service';
import { State, MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  constructor(private menuService : MenuService, private formBuilder: FormBuilder) { }

  deliverForm = this.formBuilder.group({
    name : ['', [Validators.minLength(3), Validators.maxLength(20),Validators.required]],
    lastName :  ['', [Validators.min(3), Validators.max(20), Validators.required]],
    cellphone :   ['', [Validators.min(3), Validators.required]],
    mail :        ['', [Validators.min(3), Validators.required, Validators.email]],
    password:     ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]  
  }, {
    validator: MustMatch('password', 'confirmPassword')
  })

  submitted = false
  user : Socialusers
  selectedState : State;
  states : State[];
  hide = true;
  confirmHide = true;
  
  get f() {         return this.deliverForm.controls; }
  get name(){       return this.deliverForm.get('name')}
  get lastName(){   return this.deliverForm.get('lastName')}
  get cellphone(){  return this.deliverForm.get('cellphone')}
  get mail(){       return this.deliverForm.get('mail')}
  get street(){     return this.deliverForm.get('street')}
  get doorNumber(){ return this.deliverForm.get('doorNumber')}
  get zipCode(){    return this.deliverForm.get('zipCode')}
  get floor(){      return this.deliverForm.get('floor')}
  get door(){       return this.deliverForm.get('door')}

  ngOnInit(): void {
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
