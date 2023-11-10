import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';

@Component({
  selector: 'app-add-edit-user-form',
  templateUrl: './add-edit-user-form.component.html',
  styleUrls: ['./add-edit-user-form.component.css', '../../../../app.component.css'],
})
export class AddEditUserForm extends AbstractForm implements OnDestroy, OnInit {
  // Fields
  @Input()
  formGroupName!: string;

  protected id?: number;

  protected userSubscription?: Subscription;

  /**
   * Constructor
   * @param formBuilder
   */
  constructor(
    private rootFormGroup: FormGroupDirective, private route: ActivatedRoute, private userService: UserService){
    super();
  }

  // Methods
  // Public methods
  public ngOnDestroy(): void {
      this.userSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    // Get the user id
    this.id = this.route.snapshot.params['id'];

    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;

    if(this.id){
      this.loadUser();
    }
  }

  // Private methods
  private loadUser(){
    this.userService.getById(this.id!)
    .subscribe((response) => {
      this.form.patchValue(response);
    })
  }

}
