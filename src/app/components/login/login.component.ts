import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  protected form!: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  protected onSubmit(){
    this.authService.login(this.form.controls['email'].value, this.form.controls['password'].value).subscribe({
      next: (response: any) => {
        const token = response.accessToken;

        localStorage.setItem('authToken', token);

        this.router.navigate(['../']);
      },
      // TODO Error handling
      error: (error: any) => {
        console.log(`An error ocurred: ${error.message}`);
      }
    });
  }

  protected getErrorMessage(){
    if(this.form.controls['email'].hasError('required')){
      return "You must enter a valid value";
    }

    return this.form.controls['email'].hasError('email') ? 'Not a valid value' : '';
  }
}
