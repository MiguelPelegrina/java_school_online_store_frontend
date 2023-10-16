import { Component, OnInit } from '@angular/core';
import { Country } from '../../../shared/domain/country/country';
import { CountryService } from '../../../services/country/country.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// TODO Loading animation
@Component({
  selector: 'app-list-country',
  templateUrl: './list-country.component.html',
  styleUrls: ['./list-country.component.css']
})
export class ListCountryComponent implements OnInit{
  // Fields
  public countries: Country[] = [];

  // Constructor
  /**
   *
   * @param countryService
   * @param router
   */
  constructor(private countryService: CountryService, private router: Router){}

  // Methods
  // Public
  /**
   *
   */
  public ngOnInit(): void {
      this.getAllCountries();
  }

  /**
   *
   * @param name
   */
  protected deleteCountry(name: string){
    Swal.fire({
      title: `Do you really want to delete ${name}?`,
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if(result.isConfirmed){
        this.countryService.delete(name).subscribe(response =>{
          this.getAllCountries();
          Swal.fire('Delete successful', '', 'success');
        }, error => Swal.fire('An error ocurred, contact your support', '', 'warning'));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }

  /**
   *
   * @param name
   */
  protected updateCountry(name: string){
    // TODO This is necessary for more complex classes, but not for country.
    this.router.navigate(['countries/update', name]);
  }

  /**
   *
   * @param name
   */
  protected viewCountryDetails(name: string){
    this.router.navigate(['countries/details', name]);
  }

  // Private
  /**
   *
   */
  private getAllCountries() {
    this.countryService.getAll().subscribe(countryList => {
      this.sortCountryListByActivityAndName(countryList);
      this.countries = countryList;
    });
  }

  /**
   *
   * @param countryList
   * @returns
   */
  private sortCountryListByActivityAndName(countryList: Country[]): Country[] {
    return countryList.sort((a, b) => {
      if (a.active && !b.active) {
        return -1;
      } else if (!a.active && b.active) {
        return 1;
      } else {
        // If both are active or both are inactive, compare by name
        return a.name.localeCompare(b.name);
      }
    });
  }
}
