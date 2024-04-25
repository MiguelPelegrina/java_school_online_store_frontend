import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AbstractForm } from 'src/app/components/abstract/abstract-form';

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
  public formGroupName!: string;

  @Input()
  public isAddMode = false; 

  @Output()
  public isNewPasswordEmitter = new EventEmitter<boolean>();

  protected id?: number;

  protected isNewPassword: boolean = false;

  protected userSubscription?: Subscription;

  /**
   * Constructor
   * @param rootFormGroup The form group of the root component.
   * @param route The ActivatedRoute to access route parameters.
   * @param userService The service for user-related operations.
   */
  constructor(
    private rootFormGroup: FormGroupDirective, private route: ActivatedRoute){
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

  public setNewPassword(value: string){
    if(!this.isAddMode){
      if(value.trim() === ""){
        this.isNewPassword = false;
        this.isNewPasswordEmitter.emit(false);
      } else {
        this.isNewPassword = true;
        this.isNewPasswordEmitter.emit(true);
      }      
    }
  }
}
