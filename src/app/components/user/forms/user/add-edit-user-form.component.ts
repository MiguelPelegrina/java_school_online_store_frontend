import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { AbstractForm } from 'src/app/shared/components/abstract-form';

/**
 * Component for adding or editing user information.
 */
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
   * @param rootFormGroup The form group of the root component.
   * @param route The ActivatedRoute to access route parameters.
   * @param userService The service for user-related operations.
   */
  constructor(
    private rootFormGroup: FormGroupDirective, private route: ActivatedRoute, private userService: UserService){
    super();
  }

  // Methods
  // Lifecycle Hooks
   /**
   * A lifecycle hook that is called when a directive, pipe, or service is destroyed. Used for any custom cleanup that needs to occur when the instance is destroyed.
  */
  public ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  /**
   * A lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fills form with the user, if they exist.
   */
  public ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }
}
