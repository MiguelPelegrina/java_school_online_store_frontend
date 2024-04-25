import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { AbstractForm } from 'src/app/components/abstract/abstract-form';
import { Address } from 'src/app/shared/domain/user/address/address';
import { User } from 'src/app/shared/domain/user/user';
import { AuthResultDto } from 'src/app/shared/utils/interfaces/authResultDto';
import { informUserOfError } from 'src/app/shared/utils/utils';
import Swal from 'sweetalert2';

// TODO
// - Refactor whole component:
//  - More auxiliar methods
//  - Reduce form content?

/**
 * Component for user profile management.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../app.component.css'],
})
export class ProfileComponent extends AbstractForm implements OnDestroy, OnInit {
  // Fields
  protected id?: number;

  protected isAddMode: boolean = false;

  protected isLoading = true;

  // TODO This variable to store missing properties (active, id) of user/address or hidden forms?
  protected response?: User;

  protected selectedCity: string = '';

  protected selectedCountry: string = '';

  protected selectedPostalCode: string = '';

  protected submitted = false;

  protected usersSubscription?: Subscription;

  /**
   * Constructor
   * @param authService The authentication service.
   * @param fb The form builder for creating the user profile form.
   * @param router The Angular router for navigation.
   * @param usersService The user service for managing user data.
   */
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private usersService: UserService,
    ){
    super();
  }

  // Methods
  // Lifecycle Hooks
  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
   * Unsubscribes from user subscriptions to prevent memory leaks.
   */
  public ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Loads the user data, if they are authenticated.
   */
  public ngOnInit(){
    const token = localStorage.getItem('auth_token');

    if(token){
      const tokenInfo: AuthResultDto = jwtDecode(token);
      this.id = tokenInfo.id;
    }

    if(this.id){
      this.loadUser();
    } else {
      this.isAddMode = !this.id;
      this.isLoading = false;

      this.createFormGroup();
    }
  }

  // Protected methods
  /**
   * Handles the form submission.
   * Marks all form controls as touched and proceeds with user creation or update if the form is valid.
   */
  protected onSubmit(){
    this.submitted = true;

    this.form.markAllAsTouched();

    if(!this.form.invalid){
      this.isLoading = true;

      if(this.isAddMode){
        this.createUser();
      } else {
        this.updateUser();
      }
    }
  }

  // Private methods
  /**
   * Creates the user profile form using the form builder.
   */
  private createFormGroup() {
    this.form = this.fb.group({
      personalData: this.fb.group({
        active: [true],
        dateOfBirth: [new Date(), Validators.required],
        email: ['', [Validators.required, Validators.email]],
        id: [''],
        name: ['', Validators.required],
        password: ['', Validators.required],
        phone: ['', Validators.required],
        surname: ['', Validators.required]
      }),
      address: this.fb.group({
        country: ['', Validators.required],
        city: ['', Validators.required],
        number: ['', Validators.required],
        postalCode: ['', Validators.required],
        street: ['', Validators.required]
      })
    })
  }

  /**
   * Creates a new user using the authentication service.
   */
  private createUser(){
    const address: Address = {
      active: true,
      id: 0,
      number: this.form.value.address.number,
      postalCode: this.form.value.address.postalCode,
      street: this.form.value.address.number
    }

    const user: User = {
      active: true,
      address: address,
      dateOfBirth: this.form.value.personalData.dateOfBirth,
      email: this.form.value.personalData.email,
      id: 0,
      name: this.form.value.personalData.name,
      password: this.form.value.personalData.password,
      phone: this.form.value.personalData.phone,
      roles: [],
      surname: this.form.value.personalData.surname
    };

    this.usersSubscription = this.authService.register(user).subscribe({
      next: () => {
        this.handleSuccessResponse('created');
      },
      error: (error: any) => {
        this.handleErrorResponse(error);
      }
    })
  }

  /**
   * Fills the user profile form with user data.
   * @param response The user data to fill the form with.
   */
  private fillUserForm(response: any){
    this.form = this.fb.group({
      personalData: this.fb.group({
        active: [response.active],
        dateOfBirth: [response.dateOfBirth, Validators.required],
        email: [response.email, [Validators.required, Validators.email]],
        id: [response.id],
        name: [response.name, Validators.required],
        password: ['', this.isAddMode ? Validators.required : Validators.nullValidator],
        phone: [response.phone, Validators.required],
        surname: [response.surname, Validators.required]
      }),
      address: this.fb.group({
        country: [response.address.postalCode.city.country.name, Validators.required],
        city: [response.address.postalCode.city.name, Validators.required],
        number: [response.address.number, Validators.required],
        postalCode: [response.address.postalCode.code, Validators.required],
        street: [response.address.street, Validators.required]
      })
    })

    this.selectedCity = response.address.postalCode.city.name;
    this.selectedCountry = response.address.postalCode.city.country.name;
    this.selectedPostalCode = response.address.postalCode.code;
  }

  /**
   * Loads user data using the user service.
   */
  private loadUser(): void {
    this.usersService.getById(this.id!).subscribe((response) => {
      this.response = response;

      this.fillUserForm(response)

      this.isLoading = false;
    })
  }

  /**
   * Updates the existing user using the user service.
   */
  private updateUser(): void {
    const user: User = {
      ...this.form.controls['personalData'].value,
      address: {
        id: 1,
        active: this.response?.address.active,
        number: this.form.controls['address'].value.number,
        street: this.form.controls['address'].value.street,
        postalCode: {
          active: this.response?.address.postalCode.active,
          code: this.form.controls['address'].value.postalCode,
          city: {
            active: this.response?.address.postalCode.city.active,
            name: this.form.controls['address'].value.city,
            countryName: {
              active: this.form.controls['address'].value.country.active,
              name: this.form.controls['address'].value.country
            }
          }
        }
      }
    };

    this.usersSubscription = this.usersService.update(this.id!, user).subscribe({
      next: () => {
        this.handleSuccessResponse('updated');
      },
      error: (error: any) => {
        this.handleErrorResponse(error);
      }
    })
  }

  /**
   * Handles the error response from API calls.
   * @param action The action performed when the error occurred.
   * @param error The error object.
   */
  private handleErrorResponse(error: any) {
    informUserOfError(error);
    this.isLoading = false;
  }

  /**
   * Handles the success response from API calls.
   * @param action The action performed when the operation concluded.
   */
  private handleSuccessResponse(action: string){
    Swal.fire(`User ${action}`,`The user ${this.form.value.personalData.name} has been ${action} successfully`,`success`);

    this.router.navigate(['../']);
  }
}
