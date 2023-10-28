import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Directive that limits the input of a number to up to two decimals.
 *
 * Sources:
 * - https://stackoverflow.com/questions/50722368/limit-input-field-to-two-decimal-places-angular-5
 * - https://stackblitz.com/edit/limit-two-digit-decimal-place?file=src%2Fapp%2Ftwo-digit-decima-number.directive.ts
 */
@Directive({
  selector: '[appTwoDigitDecimalNumber]'
})
export class TwoDigitDecimalNumberDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value;

    const position = this.el.nativeElement.selectionStart;

    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
