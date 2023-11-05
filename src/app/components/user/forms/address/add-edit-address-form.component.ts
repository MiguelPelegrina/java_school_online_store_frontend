import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PostalCodeService } from 'src/app/services/postal-code/postal-code.service';
import { Country } from '../../../../shared/domain/country/country';
import { City } from '../../../../shared/domain/user/address/postal-code/city/city';
import { PostalCode } from '../../../../shared/domain/user/address/postal-code/postal-code';
import { AddressService } from 'src/app/services/address/address.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';

@Component({
  selector: 'app-add-edit-address-form',
  templateUrl: './add-edit-address-form.component.html',
  styleUrls: ['./add-edit-address-form.component.css' , '../../../../app.component.css'],
})
export class AddEditAddressForm extends AbstractForm implements OnDestroy, OnInit {
  // Fields
  @Input()
  public formGroupName!: string;

  @Input()
  public selectedCountry?: string = '';

  @Input()
  public selectedCity?: string = '';

  @Input()
  public selectedPostalCode?: string = '';

  protected addressSubscription?: Subscription;

  protected cities: City[] = [];

  protected citySubscription?: Subscription;

  protected countrySubscription?: Subscription;

  protected countries: Country[] = [];

  protected id?: number;

  protected isCountrySelected = false;

  protected postalCodes: PostalCode[] = [];

  protected postalCodeSubscription?: Subscription;

  // Constructor
  constructor(
    private cityService: CityService,
    private countryService: CountryService,
    private postalCodeService: PostalCodeService,
    private rootFormGroup: FormGroupDirective,
    ){
    super();
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
    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    this.loadCountries();

    this.selectedCountry = this.form.value.country;
    this.selectedCity = this.form.value.city;

    if(!(this.selectedCountry?.length == 0)){
      this.loadCities();
    }

    if(!(this.selectedCity?.length == 0)){
      this.loadPostalCodes();
    }
  }

  // Protected methods
  protected onCitySelected(city: City): void{
    this.postalCodeService.getAll(true, city.name).subscribe(() => {
      this.selectedPostalCode = '';
      this.loadPostalCodes();
    })
  }

  protected onCountrySelected(country: Country): void{
    this.cityService.getAll(true, country.name).subscribe(() => {
      this.selectedCity = '';
      this.selectedPostalCode = '';
      this.loadCities();
    });
  }

  // Private methods
  private loadCities(): void{
    this.citySubscription = this.cityService.getAll(true,this.selectedCountry).subscribe(cityList => {
      this.cities = cityList;
    });
  }

  private loadCountries(): void{
    this.countrySubscription = this.countryService.getAll(true).subscribe(countryList => {
      this.countries = countryList;
    });
  }

  private loadPostalCodes(): void{
    this.postalCodeSubscription = this.postalCodeService.getAll(true, this.selectedCity).subscribe(postalCodeList => {
      this.postalCodes = postalCodeList;
    });
  }
}
