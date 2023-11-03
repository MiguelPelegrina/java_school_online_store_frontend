import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PostalCodeService } from 'src/app/services/postal-code/postal-code.service';
import { Country } from '../../../../shared/domain/country/country';
import { City } from '../../../../shared/domain/user/address/postal-code/city/city';
import { PostalCode } from '../../../../shared/domain/user/address/postal-code/postal-code';
import { ActivatedRoute } from '@angular/router';
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
  public selectedCountry?: Country;

  @Input()
  public selectedCity?: City;

  @Input()
  public selectedPostalCode?: PostalCode;

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
    private addressService: AddressService,
    private cityService: CityService,
    private countryService: CountryService,
    private postalCodeService: PostalCodeService,
    private rootFormGroup: FormGroupDirective,
    private route: ActivatedRoute,
    ){
    super();
  }

  // Methods
  // Public methods
  public loadAddress(id: number): void{
    this.addressSubscription = this.addressService.getById(id)
    .subscribe((response) => {
      this.selectedCountry = response.postalCode.city.country;

      this.selectedCity = response.postalCode.city;

      this.selectedPostalCode = response.postalCode;

      this.form.patchValue(response);
    })
  }

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
      this.loadAddress(this.id);
      this.loadCities();
      this.loadPostalCodes();
    }
  }

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

  // Private methods


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
}
