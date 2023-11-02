import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../app.component.css']
})
export class ProfileComponent implements OnInit{
  // Fields
  protected form!: FormGroup;

  constructor(private fb: FormBuilder){}

  public ngOnInit(): void {
    this.form = this.fb.group({
        personalData: this.fb.group({
          dateOfBirth: [new Date(), Validators.required],
          email: ['', Validators.required, Validators.email],
          id: ['', Validators.required],
          active: [''],
          name: ['', Validators.required],
          password: ['', Validators.required],
          phone: ['', Validators.required],
          roles: this.fb.array([]),
          surname: ['', Validators.required]
        }),
        // TODO Needs to be an array of addresses
        address: this.fb.group({
          country: ['', Validators.required],
          city: ['', Validators.required],
          number: ['', Validators.required],
          postalCode: ['', Validators.required],
          street: ['', Validators.required]
        })
    })
  }
}
