import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../app.component.css']
})
export class ProfileComponent extends AbstractForm implements OnInit {
  // Fields
  protected id?: number;

  protected loading = false;

  protected submitted = false;

  protected usersSubscription?: Subscription;

  /**
   *
   * @param fb
   * @param route
   * @param service
   */
  constructor(private fb: FormBuilder, private router: Router, private service: UserService){
    super();
  }

  // Methods
  // Public methods
  public ngOnInit(): void {
    // Get the user id
    this.id = JSON.parse(localStorage.getItem('id') || '{}');

    this.form = this.fb.group({
        personalData: this.fb.group({
          dateOfBirth: [new Date(), Validators.required],
          email: ['', [Validators.required, Validators.email]],
          id: [''],
          active: [''],
          name: ['', Validators.required],
          // TODO Not sure about this. Once logged in, it should not be necessary to introduced the password again for changes, or?
          password: ['', Validators.required],
          phone: ['', Validators.required],
          surname: ['', Validators.required]
        }),
        // TODO Needs to be an array of addresses
        address: this.fb.group({
          country: [''],
          city: [''],
          number: [''],
          postalCode: [''],
          street: ['']
        })
    })

    if(this.id){
      this.loadUser(this.id);
    }
  }

  protected onSubmit(){
    this.submitted = true;

    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid);

    if(!this.form.invalid){
      this.loading = true;

      this.updateUser();
    }
  }

  private loadUser(id: number){
    this.service.getById(id).subscribe((response) => {
      this.form.controls['personalData'].patchValue(response);

      // if(response.address){
      // if(response.address){
      //   this.form.controls['address'].patchValue(response.address);
      // }
      //   this.form.patchValue({
      //     address: {
      //       country: response.address.postalCode.city.countryName.name,
      //       city: response.address.postalCode.city.name,
      //       number: response.address.street,
      //       postalCode: response.address.postalCode,
      //       street: response.address.street
      //     }
      //   })
      // }
    })
  }

  private updateUser(){
    console.log(this.form.value)
    this.usersSubscription = this.service.update(this.id!, this.form.controls['personalData'].value).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
      },
      // TODO Error handling
      error: (response: any) => {
        this.handleErrorResponse(response.error);
      }
    })
  }

  private handleErrorResponse(error: any) {
    Swal.fire('Error', `You could not change your data: ${error}` , 'warning');

    this.loading = false;
  }

  private handleSuccessResponse(response: any){
    Swal.fire(`User update successful!`,`You have changed your data successfully`,`success`);

    this.router.navigate(['../']);
  }
}
