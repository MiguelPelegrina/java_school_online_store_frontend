import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import { Country } from 'src/app/shared/domain/country/country';
import { City } from 'src/app/shared/domain/user/address/postal-code/city/city';
import { PostalCode } from 'src/app/shared/domain/user/address/postal-code/postal-code';
import { User } from 'src/app/shared/domain/user/user';
import Swal from 'sweetalert2';
import { AddEditAddressForm } from '../forms/address/add-edit-address-form.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../app.component.css']
})
export class ProfileComponent extends AbstractForm implements OnDestroy, OnInit {
  // Fields
  protected id?: number;

  protected isAddMode?: boolean;

  protected loading = false;

  protected response: any;

  protected selectedCity?: City;

  protected selectedCountry?: Country;

  protected selectedPostalCode?: PostalCode;

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
    private usersService: UserService){
    super();
  }

  public ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }

  // Methods
  // Public methods
  public ngOnInit(): void {
    // Get the user id
    // TODO Improve this
    this.id = JSON.parse(localStorage.getItem('id') || '{}');

    this.isAddMode = !this.id;

    if(this.isAddMode){
      this.loading = false;
    }

    this.form = this.fb.group({
        personalData: this.fb.group({
          dateOfBirth: [new Date(), Validators.required],
          email: ['', [Validators.required, Validators.email]],
          id: [''],
          active: [''],
          name: ['', Validators.required],
          // TODO Not sure about this. Once logged in, it should not be necessary to introduced the password again for changes, or?
          password: ['', this.isAddMode ? Validators.required : []],
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

    if(this.id){
      this.loadUser();
    }
  }

  protected onSubmit(){
    this.submitted = true;

    if(!this.form.invalid){
      this.loading = true;

      if(this.isAddMode){
        this.createUser();
      } else {
        this.updateUser();
      }
    }
  }

  // Private methods
  private createUser(){
    const user: User = {
      ...this.form.controls['personalDate'].value,
      address: this.form.controls['address'].value
    };

    this.usersSubscription = this.authService.register(user).subscribe({
      next: () => {
        this.handleSuccessResponse();
      },
      // TODO Error handling
      error: (response: any) => {
        this.handleErrorResponse(response.error);
      }
    })
  }

  private loadUser(): void {
    this.usersService.getById(this.id!).subscribe((response) => {
      this.response = response;

      // TODO Fix select not selecting loaded value

      this.form.controls['personalData'].patchValue(response);
      this.form.controls['address'].patchValue(response.address);

      this.loading = false;
    })
  }

  private updateUser(): void {
    const user: User = {
      ...this.form.controls['personalData'].value,
      address: {
        id: 1,
        active: this.form.controls['address'].value.postalCode.active,
        number: this.form.controls['address'].value.number,
        street: this.form.controls['address'].value.street,
        postalCode: {
          active: this.form.controls['address'].value.postalCode.active,
          code: this.form.controls['address'].value.postalCode.code,
          city: {
            active: this.form.controls['address'].value.city.active,
            name: this.form.controls['address'].value.city.name,
            countryName: {
              active: this.form.controls['address'].value.country.active,
              name: this.form.controls['address'].value.country.name
            }
          }
        }
      }
    };

    this.usersSubscription = this.usersService.update(this.id!, user).subscribe({
      next: () => {
        this.handleSuccessResponse();
      },
      // TODO Error handling
      error: (response: any) => {
        this.handleErrorResponse(response.error);
      }
    })
  }

  private handleErrorResponse(error: any) {
    Swal.fire('Error', `You could not change your data: ${error}` , 'warning');

    this.loading = false;
  }

  private handleSuccessResponse(){
    Swal.fire(`Your update was successful!`,`You have changed your data successfully`,`success`);

    this.router.navigate(['../']);
  }
}
