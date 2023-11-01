import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Subform } from 'src/app/shared/components/sub-form';

@Component({
  selector: 'app-add-edit-user-form',
  templateUrl: './add-edit-user-form.component.html',
  styleUrls: ['./add-edit-user-form.component.css', '../../../../app.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddEditUserForm),
      multi: true,
    }
  ]
})
export class AddEditUserForm extends Subform implements OnInit{
  // Fields
  @Input()
  isAddMode?: boolean;

  protected id?: number;

  protected userSubscription?: Subscription;

  /**
   * Constructor
   * @param formBuilder
   */
  constructor(
    private formBuilder: FormBuilder, private route: ActivatedRoute, private userService: UserService){
    super();
  }

  // Methods
  // Public methods
  public override ngOnDestroy(): void {
      super.ngOnDestroy;
      this.userSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    // Get the user id
    this.id = this.route.snapshot.params['id']
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
      addresses: this.formBuilder.array([]),
      dateOfBirth: [new Date(), Validators.required],
      email: ['', Validators.required, Validators.email],
      id: ['', Validators.required],
      active: [''],
      name: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      roles: this.formBuilder.array([]),
      surname: ['', Validators.required]
    })

    if(this.id){
      this.loadUser();
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

  // Private methods
  private loadUser(){
    this.userService.getById(this.id!)
    .subscribe((response) => {
      this.form.patchValue(response);
    })
  }

}
