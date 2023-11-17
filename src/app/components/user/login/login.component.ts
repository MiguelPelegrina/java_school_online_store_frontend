import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import Swal from 'sweetalert2';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthUtils } from 'src/app/shared/utils/auth-utils';
import { informUserOfError } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../app.component.css']
})
export class LoginComponent extends AbstractForm {

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private permissionsService: NgxPermissionsService, private router: Router){
    super();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  protected onSubmit(){
    this.authService.login(this.f['email'].value, this.f['password'].value).subscribe({
      next: (response: any) => {
        this.authService.setAuthResultDto(response);

        this.permissionsService.loadPermissions(AuthUtils.getRoles())

        this.router.navigate(['../']);
      },
      error: (error: any) => {
        informUserOfError(error);
      }
    });
  }
}

