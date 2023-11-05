import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import { Address } from 'src/app/shared/domain/user/address/address';
import { User } from 'src/app/shared/domain/user/user';
import { AuthResultDto } from 'src/app/shared/utils/authResultDto';
import Swal from 'sweetalert2';

// TODO
// - Implement user creation
// - Refactor whole component:
//  - More auxiliar methods
//  - Reduce form content?

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../app.component.css'],
})
export class ProfileComponent extends AbstractForm implements OnDestroy {
  // Fields
  protected id?: number;

  protected isAddMode?: boolean;

  protected loading = true;

  // TODO This variable to store missing properties (active, id) of user/address or hidden forms?
  protected response?: User;

  protected selectedCity: string = '';

  protected selectedCountry: string = '';

  protected selectedPostalCode: string = '';

  protected submitted = false;

  protected usersSubscription?: Subscription;

  /**
   *
   * @param fb
   * @param route
   * @param usersService
   */
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private usersService: UserService,
    ){
    super();

    // TODO Needs to change?
    const token = localStorage.getItem('auth_token');

    if(token){
      const tokenInfo: AuthResultDto = jwtDecode(token);
      this.id = tokenInfo.id;
    }

    if(this.id){
      this.loadFilledUserForm();
    } else {
      this.isAddMode = !this.id;
      this.loading = false;

      this.createFormGroup();
    }
  }

  public ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }

  // Methods
  // Public methods
  protected onSubmit(){
    this.submitted = true;

    this.form.markAllAsTouched();

    if(!this.form.invalid){
      this.loading = true;

      if(this.isAddMode){
        console.log('addmode')
        this.createUser();
      } else {
        this.updateUser();
      }
    }
  }

  // Private methods
  private createFormGroup() {
    this.form = this.fb.group({
      personalData: this.fb.group({
        active: [true],
        dateOfBirth: [new Date(), Validators.required],
        email: ['', [Validators.required, Validators.email]],
        id: [''],
        name: ['', Validators.required],
        // TODO Not sure about this. Once logged in, it should not be necessary to introduced the password again for changes, or?
        // TODO Not showing when invalid
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


  private createUser(){
    // TODO Assign proper values
    console.log(this.form.value)
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
    console.log(user);

    this.usersSubscription = this.authService.register(user).subscribe({
      next: () => {
        this.handleSuccessResponse('created');
      },
      // TODO Error handling
      error: (error: any) => {
        this.handleErrorResponse('created', error);
      }
    })
  }

  private loadFilledUserForm(): void {
    this.usersService.getById(this.id!).subscribe((response) => {
      this.response = response;

      this.form = this.fb.group({
        personalData: this.fb.group({
          active: [response.active],
          dateOfBirth: [response.dateOfBirth, Validators.required],
          email: [response.email, [Validators.required, Validators.email]],
          id: [response.id],
          name: [response.name, Validators.required],
          // TODO Not sure about this. Once logged in, it should not be necessary to introduced the password again for changes, or?
          password: ['', Validators.required],
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

      this.loading = false;
    })
  }

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
      // TODO Error handling
      error: (error: any) => {
        this.handleErrorResponse('updated', error);
      }
    })
  }

  private handleErrorResponse(action: string, error: any) {
    // TODO Chane error message
    Swal.fire('Error', `The user could not be ${action}: ${error.error}` , 'warning');

    this.loading = false;
  }

  private handleSuccessResponse(action: string){
    Swal.fire(`User ${action}`,`The user ${this.form.value.personalData.name} has been ${action} successfully`,`success`);

    this.router.navigate(['../']);
  }
}
