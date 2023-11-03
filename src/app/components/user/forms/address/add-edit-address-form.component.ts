import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PostalCodeService } from 'src/app/services/postal-code/postal-code.service';
import { Country } from '../../../../shared/domain/country/country';
import { City } from '../../../../shared/domain/user/address/postal-code/city/city';
import { PostalCode } from '../../../../shared/domain/user/address/postal-code/postal-code';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from 'src/app/services/address/address.service';

@Component({
  selector: 'app-add-edit-address-form',
  templateUrl: './add-edit-address-form.component.html',
  styleUrls: ['./add-edit-address-form.component.css' , '../../../../app.component.css'],
})
export class AddEditAddressForm implements OnDestroy, OnInit {
  // Fields
  @Input()
  formGroupName!: string;

  protected addressSubscription?: Subscription;

  protected cities: City[] = [];

  protected citySubscription?: Subscription;

  protected countrySubscription?: Subscription;

  protected countries: Country[] = [];

  protected form!: FormGroup;

  protected id?: number;

  protected isCountrySelected = false;

  protected postalCodes: PostalCode[] = [];

  protected postalCodeSubscription?: Subscription;

  protected selectedCountry?: string;

  protected selectedCity: string = '';

  protected selectedPostalCode: string = '';

  // Constructor
  constructor(
    private addressService: AddressService,
    private cityService: CityService,
    private countryService: CountryService,
    private postalCodeService: PostalCodeService,
    private rootFormGroup: FormGroupDirective,
    private route: ActivatedRoute,
    ){
  }

  // Methods
  // Public methods
  public ngOnDestroy(): void {
    this.addressSubscription?.unsubscribe();
    this.citySubscription?.unsubscribe();
    this.countrySubscription?.unsubscribe();
    this.postalCodeSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    // Get the address id
    this.id = this.route.snapshot.params['id'];

    this.loadCountries();

    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    if(this.id){
      this.loadAddress();
      this.loadCities();
      this.loadPostalCodes();
    }
  }

  // Protected methods
  /**
   * Gets access to form fields
   */
  protected get f(){
    return this.form.controls;
  }

  protected getErrorMessage(value: string){
    if(this.form.controls[value].hasError('required')){
      return "You must enter a valid value";
    }

    return this.form.controls[value].hasError(value) ? 'Not a valid value' : '';
  }

  protected onCitySelected(city: string){
    this.postalCodeService.getAll(true, city).subscribe((response) => {
      this.postalCodes = response;
    })
  }

  protected onCountrySelected(country: string){
    this.cityService.getAll(true, country).subscribe((response) => {
      this.cities = response;
    });
  }

  // Private methods
  private loadAddress(){
    this.addressSubscription = this.addressService.getById(this.id!)
    .subscribe((response) => {
      this.selectedCountry = response.postalCode.city.countryName.name;

      this.selectedCity = response.postalCode.city.name;

      this.selectedPostalCode = response.postalCode.code;

      this.form.patchValue(response);
    })
  }

  private loadCities(){
    this.citySubscription = this.cityService.getAll().subscribe(cityList => {
      this.cities = cityList;
    });
  }

  private loadCountries(){
    this.countrySubscription = this.countryService.getAll(true).subscribe(countryList => {
      this.countries = countryList;
    });
  }

  private loadPostalCodes(){
    this.postalCodeSubscription = this.postalCodeService.getAll().subscribe(postalCodeList => {
      this.postalCodes = postalCodeList;
    });
  }
}
