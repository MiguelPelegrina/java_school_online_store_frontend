import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PostalCodeService } from 'src/app/services/postal-code/postal-code.service';
import { Country } from '../../domain/country/country';
import { City } from '../../domain/user/address/postal-code/city/city';
import { PostalCode } from '../../domain/user/address/postal-code/postal-code';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from 'src/app/services/address/address.service';
import { Subform } from '../sub-form';

@Component({
  selector: 'app-address-selector',
  templateUrl: './address-selector.component.html',
  styleUrls: ['./address-selector.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressSelectorComponent),
      multi: true,
    }
  ]
})
export class AddressSelectorComponent extends Subform implements ControlValueAccessor, OnInit {
  // Fields
  protected addressSubscription?: Subscription;

  protected cities: City[] = [];

  protected citySubscription?: Subscription;

  protected countrySubscription?: Subscription;

  protected countries: Country[] = [];

  protected id?: number;

  protected isAddMode = false;

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
    private formBuilder: FormBuilder,
    private postalCodeService: PostalCodeService,
    private route: ActivatedRoute,
    ){
    super();
  }

  // Methods
  // Public methods
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.addressSubscription?.unsubscribe();
    this.countrySubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    // Get the address id
    this.id = this.route.snapshot.params['id']
    this.isAddMode = !this.id;

    this.loadCountries();

    this.form = this.formBuilder.group({
      country: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required]
    })

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
