import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { Calendar } from 'primeng/calendar';

@Directive({
  selector: '[appDateFormat]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DateFormatDirective,
      multi: true
    }
  ]
})
export class DateFormatDirective implements Validator {
  @Input() minYear: number = 1800;
  private readonly currentYear = new Date().getFullYear();
  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Return null if date is not required
    }

    const date = control.value instanceof Date ? control.value : new Date(control.value);
    
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    const year = date.getFullYear();

    if (year < this.minYear) {
      return { yearTooEarly: { min: this.minYear } };
    }

    if (year > this.currentYear + 1) {
      return { yearTooLate: { max: this.currentYear + 1 } };
    }
    return null;
  }
}