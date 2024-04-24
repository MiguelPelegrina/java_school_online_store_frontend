import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { AbstractForm } from 'src/app/components/abstract/abstract-form';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthUtils } from 'src/app/shared/utils/auth-utils';
import { informUserOfError } from 'src/app/shared/utils/utils';

/**
 * Component for user login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../app.component.css']
})
export class LoginComponent extends AbstractForm {
  /**
   * Constructor
   * @param authService The authentication service.
   * @param formBuilder The form builder for creating the login form.
   * @param permissionsService The service for handling user permissions.
   * @param router The Angular router for navigation.
   */
  constructor(private authService: AuthService, private formBuilder: FormBuilder, private permissionsService: NgxPermissionsService, private router: Router){
    super();
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Handles the form submission.
   * Calls the authentication service to log in the user.
   * Navigates to the previous page on successful login.
   */
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

