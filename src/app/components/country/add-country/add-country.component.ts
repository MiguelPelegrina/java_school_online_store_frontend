import { Component } from '@angular/core';
import { Country } from '../../../shared/domain/country/country';
import { FormsModule } from '@angular/forms';
import { CountryService } from '../../../services/country/country.service';
import { Router } from '@angular/router';
import { StringValues } from '../../../shared/string-values';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css']
})
export class AddCountryComponent extends FormsModule {
  protected country: Country = {name: '', active: false};

  constructor(private router: Router, private service: CountryService, private snackbar: MatSnackBar){
    super();
  }

  protected onSubmit(){
      this.saveCountry();
  }

  protected saveCountry(){
    this.service.create(this.country).subscribe(response => {
      this.snackbar.open("Country saved");
      this.navigateToCountryList();
    });
  }

  private navigateToCountryList(){
    this.router.navigate([`${StringValues.COUNTRY_URL}`]);
  }
}
