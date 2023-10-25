import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  protected form!: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  protected onSubmit(){
    this.authService.login(this.form.controls['email'].value, this.form.controls['password'].value);
  }

  protected getErrorMessage(){
    if(this.form.controls['email'].hasError('required')){
      return "You must enter a valid value";
    }

    return this.form.controls['email'].hasError('email') ? 'Not a valid value' : '';
  }
}
