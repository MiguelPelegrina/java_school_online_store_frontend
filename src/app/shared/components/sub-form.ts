import { Directive, OnDestroy } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormGroup, ValidationErrors } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

@Directive()
export class Subform implements ControlValueAccessor, OnDestroy{
  // Fields
  protected destroySubject = new Subject<void>();

  protected form!: FormGroup;

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  // propagates value changes to parent form control when nested address form changes
  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(fn);
  }

  // marks parent form control as touched when nested address form changes
  registerOnTouched(fn: any): void {
    this.form.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(fn);
  }

  // disabled nested address form when parent form control is disabled
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  // propagates validation errors from nested address form to parent form control
  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { address: true };
  }

  // writes value to nested address form when value is set to parent form control
  writeValue(obj: any): void {
    this.form.patchValue(obj, { emitEvent: false});
  }
}
