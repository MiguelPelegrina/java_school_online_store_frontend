import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PostalCodeService } from 'src/app/services/postal-code/postal-code.service';
import { UserService } from 'src/app/services/user.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import { Country } from 'src/app/shared/domain/country/country';
import { City } from 'src/app/shared/domain/user/address/postal-code/city/city';
import { PostalCode } from 'src/app/shared/domain/user/address/postal-code/postal-code';
import { User } from 'src/app/shared/domain/user/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-profile',
  templateUrl: './add-edit-profile.component.html',
  styleUrls: ['./add-edit-profile.component.css', '../../../app.component.css']
})
export class AddEditProfileComponent extends AbstractForm implements OnDestroy, OnInit{
  // Fields
  protected id: any;

  public selectedCity?: string;

  public selectedCountry?: string;

  public selectedPostalCode?: string;

  protected cities: City[] = [];

  protected citySubscription?: Subscription;

  protected countrySubscription?: Subscription;

  protected countries: Country[] = [];

  protected isAddMode?: boolean;

  protected loading = false;

  protected postalCodes: PostalCode[] = [];

  protected postalCodeSubscription?: Subscription;

  protected submitted = false;

  protected userSubscription?: Subscription;

  constructor(
    private cityService: CityService,
    private countryService: CountryService,
    private fb: FormBuilder,
    private postalCodeService: PostalCodeService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
  ){
    super();
    this.id = JSON.parse(localStorage.getItem('id') || '{}');
  }

  ngOnDestroy(): void {
    this.citySubscription?.unsubscribe();
    this.countrySubscription?.unsubscribe();
    this.postalCodeSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      dateOfBirth: [new Date(), Validators.required],
      email: ['', [Validators.required, Validators.email]],
      id: [''],
      active: [''],
      name: ['', Validators.required],
      // TODO Not sure about this. Once logged in, it should not be necessary to introduced the password again for changes, or?
      password: ['', Validators.required],
      phone: ['', Validators.required],
      surname: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      number: ['', Validators.required],
      postalCode: ['', Validators.required],
      street: ['', Validators.required]
    })

    this.loadCountries();

    if(this.id !== '{}'){
      this.loadUser();
    }

    this.loadCities();
    this.loadPostalCodes();

  }

  // Methods
  // Public methods


  // Protected methods
  protected onCitySelected(city: City): void{
    this.postalCodeService.getAll(true, city.name).subscribe((response) => {
      this.postalCodes = response;
    })
  }

  protected onCountrySelected(country: Country): void{
    this.cityService.getAll(true, country.name).subscribe((response) => {
      this.cities = response;
    });
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

    this.userSubscription = this.authService.register(user).subscribe({
      next: () => {
        this.handleSuccessResponse();
      },
      // TODO Error handling
      error: (response: any) => {
        this.handleErrorResponse(response.error);
      }
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

    this.userSubscription = this.userService.update(this.id!, user).subscribe({
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

  private loadCities(): void{
    this.citySubscription = this.cityService.getAll(true).subscribe(cityList => {
      this.cities = cityList;
    });
  }

  private loadCountries(): void{
    this.countrySubscription = this.countryService.getAll(true).subscribe(countryList => {
      this.countries = countryList;
    });
  }

  private loadPostalCodes(): void{
    this.postalCodeSubscription = this.postalCodeService.getAll(true).subscribe(postalCodeList => {
      this.postalCodes = postalCodeList;
    });
  }

  private loadUser(){
    this.userService.getById(this.id!).subscribe((response) => {
      this.form.patchValue(response);

      console.log(response)
      console.log(this.form.value)

      this.form.patchValue({
        'country': response.address.postalCode.city.country.name,
        'city':  response.address.postalCode.city.name,
        'number': response.address.number,
        'postalCode':  response.address.postalCode.code,
        'street': response.address.street
      })
      this.selectedCountry = response.address.postalCode.city.country.name
      this.selectedCity = response.address.postalCode.city.name
      this.selectedPostalCode = response.address.postalCode.code
      console.log(this.form.value)

    })
  }
}
