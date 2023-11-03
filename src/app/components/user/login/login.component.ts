import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AbstractForm } from 'src/app/shared/components/abstract-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends AbstractForm {

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router){
    super();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  protected onSubmit(){
    this.authService.login(this.f['email'].value, this.f['password'].value).subscribe({
      next: (response: any) => {
        console.log(response)
        this.authService.setAuthResultDto(response);

        this.router.navigate(['../']);
      },
      // TODO Error handling
      error: (error: any) => {
        console.log(`An error ocurred: ${error.message}`);
      }
    });
  }
}
