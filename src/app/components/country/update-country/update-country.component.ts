import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from 'src/app/services/country/country.service';
import { Country } from 'src/app/shared/domain/country/country';
import { StringValues } from 'src/app/shared/string-values';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-country',
  templateUrl: './update-country.component.html',
  styleUrls: ['./update-country.component.css']
})
export class UpdateCountryComponent extends FormsModule implements OnInit{
  protected name: string = '';
  protected country: Country = {name: '', active: true};

  constructor(private service: CountryService, private router: Router, private route: ActivatedRoute){
    super();
  }

  public ngOnInit(): void {
    this.name = this.route.snapshot.params['name'];
    this.service.getById(this.name!).subscribe(response => {
      this.country = response;
    }, error => console.log(error));
  }


  protected navigateToCountryList(){
    this.router.navigate([`${StringValues.COUNTRY_URL}`])
    // TODO Check if changes were made
    Swal.fire('Country updated',`The country ${this.country.name} has been updated successfully`,`success`);
  }

  protected onSubmit(){
    this.service.update(this.name, this.country).subscribe(response => {
      this.navigateToCountryList();
    }, error => console.log(error));
  }

  protected saveCountry(){
    this.service.create(this.country).subscribe(response => {
      this.navigateToCountryList();
    }, error => console.log(error));
  }
}
