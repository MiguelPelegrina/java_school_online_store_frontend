import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from 'src/app/services/country/country.service';
import { Country } from 'src/app/shared/domain/country/country';

// TODO Add an edit (pencil icon) button to change this specific country

@Component({
  selector: 'app-detail-country',
  templateUrl: './detail-country.component.html',
  styleUrls: ['./detail-country.component.css']
})
export class DetailCountryComponent {
  // Fields
  // TODO Not sure if default values or undefined fields with ? and continous checking with if's and ngIf's is better
  protected id: string = '';
  protected country: Country = { name: '', active: false};

  constructor(private router: ActivatedRoute, private service: CountryService){}

  ngOnInit(): void{
    this.id = this.router.snapshot.params['name'];
    this.service.getById(this.id).subscribe(response => {
      this.country = response;
    });
  }
}
