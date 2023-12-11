import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CityService } from 'src/app/services/city/city.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PostalCodeService } from 'src/app/services/postal-code/postal-code.service';
import { Country } from '../../../../shared/domain/country/country';
import { City } from '../../../../shared/domain/user/address/postal-code/city/city';
import { PostalCode } from '../../../../shared/domain/user/address/postal-code/postal-code';
import { AbstractForm } from 'src/app/shared/components/abstract-form';

/**
 * Component for adding or editing address information.
 */
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

  protected cities: City[] = [];

  protected countries: Country[] = [];

  protected id?: number;

  protected isCountrySelected = false;

  protected postalCodes: PostalCode[] = [];

  private addressSubscription?: Subscription;

  private citySubscription?: Subscription;

  private countrySubscription?: Subscription;

  private postalCodeSubscription?: Subscription;

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
  // Lifecycle Hooks
  /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
  */
  public ngOnDestroy(): void {
    this.addressSubscription?.unsubscribe();
    this.citySubscription?.unsubscribe();
    this.countrySubscription?.unsubscribe();
    this.postalCodeSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills form with the user, if they exist.
   */
  public ngOnInit(): void {
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
  /**
   * Handles the city selection event. Loads postal codes based on the selected city.
   * @param city The selected city.
   */
  protected onCitySelected(): void{
    this.postalCodeService.getAll(true, this.selectedCity).subscribe(() => {
      this.selectedPostalCode = '';
      this.loadPostalCodes();
    })
  }

  /**
   * Handles the country selection event. Loads cities and resets selected city and postal code.
   * @param country The selected country.
   */
  protected onCountrySelected(): void{
    this.cityService.getAll(true, this.selectedCountry).subscribe(() => {
      this.selectedCity = '';
      this.selectedPostalCode = '';
      this.loadCities();
    });
  }

  // Private methods
  /**
   * Loads cities based on the selected country.
   */
  private loadCities(): void{
    this.citySubscription = this.cityService.getAll(true, this.selectedCountry).subscribe(cityList => {
      this.cities = cityList;
    });
  }

  /**
   * Loads countries.
   */
  private loadCountries(): void{
    this.countrySubscription = this.countryService.getAll(true).subscribe(countryList => {
      this.countries = countryList;
    });
  }

  /**
   * Loads postal codes based on the selected city.
   */
  private loadPostalCodes(): void{
    this.postalCodeSubscription = this.postalCodeService.getAll(true, this.selectedCity).subscribe(postalCodeList => {
      this.postalCodes = postalCodeList;
    });
  }
}
