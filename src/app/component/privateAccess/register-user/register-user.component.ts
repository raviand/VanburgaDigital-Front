import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Client } from 'src/app/service/order.service';
import { Socialusers, LoginService } from 'src/app/service/login.service';
import { State, MenuService } from 'src/app/service/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  constructor(private menuService : MenuService, private formBuilder: FormBuilder, private loginService : LoginService,
    private router : Router) { }

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
  get password(){     return this.deliverForm.get('password')}

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
    this.user = new Socialusers;
    this.user.name = this.deliverForm.value.name
    this.user.email = this.deliverForm.value.mail
    this.user.password = btoa(this.deliverForm.value.password)
    this.user.phone = this.deliverForm.value.cellphone
    console.log(this.user)
    this.loginService.Savesresponse(this.user).subscribe(
      res => {
        console.log(res)
        localStorage.setItem('socialusers', JSON.stringify( this.user));  
        console.log(localStorage.setItem('socialusers', JSON.stringify(this.user)));  
        this.router.navigate([`/menu`]);  
      }
    )
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
