import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import { User } from 'src/app/shared/domain/user/user';
import Swal from 'sweetalert2';

// TODO
// - Fix select not showing loaded values until a form is clicked
// - Refator form --> too much duplicated code

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent extends AbstractForm implements OnDestroy, OnInit {
  // Fields
  protected id?: number;

  protected isAddMode?: boolean;

  protected loading = false;

  // TODO This variable to store missing properties (active, id) of user/address or hidden forms?
  protected response?: User;

  protected selectedCity?: string;

  protected selectedCountry?: string;

  protected selectedPostalCode?: string;

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
    private cd: ChangeDetectorRef){
    super();

    this.id = JSON.parse(localStorage.getItem('id') || '0');

    this.isAddMode = !this.id;

    if(this.isAddMode){
      this.loading = false;
    }

    if(this.id != 0){
      // TODO Can this be refactored? Even with patch value, the amount of lines is the same
      this.loadUser();
    } else {
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
  }

  public ngOnDestroy(): void {
    this.usersSubscription?.unsubscribe();
  }

  // Methods
  // Public methods
  public ngOnInit(): void {

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
      console.log('response', this.response)
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


      console.log(this.form.value)

      this.loading = false;

      this.cd.detectChanges();
    })
  }

  private updateUser(): void {
    console.log('form', this.form.value)

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
    console.log('user',user)

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
