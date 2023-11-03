import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends AbstractForm {
  // Fields
  protected loading = false;

  protected submitted = false;

  protected usersSubscription?: Subscription;

  constructor(private fb: FormBuilder, private router: Router, private service: AuthService){
    super();
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
        personalData: this.fb.group({
          dateOfBirth: [new Date(), Validators.required],
          email: ['', [Validators.required, Validators.email]],
          id: [''],
          active: [true],
          name: ['', Validators.required],
          password: ['', Validators.required],
          phone: ['', Validators.required],
          // roles: ['USER'],
          // TODO Not sure whats the best way to handle user roles. Current approach is to assign user role by default and let the admin handle adding new roles to an user
          // this.fb.array([]),
          surname: ['', Validators.required]
        }),
    })
  }

  protected onSubmit(){
    this.submitted = true;

    if(!this.form.invalid){
      this.loading = true;

      this.createUser();
    }
  }

  private createUser(){
    this.usersSubscription = this.service.register(
      this.form.value.personalData.dateOfBirth,
      this.form.value.personalData.email,
      this.form.value.personalData.name,
      this.form.value.personalData.password,
      this.form.value.personalData.phone,
      this.form.value.personalData.surname
    ).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
      },
      // TODO Error handling
      error: (response: any) => {
        this.handleErrorResponse(response.error);
      }
    })
  }

  private handleErrorResponse(error: any) {
    Swal.fire('Error', `You could not be registered: ${error}` , 'warning');
    this.loading = false;
  }

  private handleSuccessResponse(response: any){
    this.service.setAuthResultDto(response);

    Swal.fire(`Registry successful!`,`You have been registered successfully`,`success`);

    this.router.navigate(['../']);
  }
}
