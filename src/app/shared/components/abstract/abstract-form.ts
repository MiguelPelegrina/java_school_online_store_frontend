import { FormGroup } from "@angular/forms";

export class AbstractForm {
  public form!: FormGroup;

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
}
