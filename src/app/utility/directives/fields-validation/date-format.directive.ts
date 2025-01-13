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
export class DateFormatDirective implements OnInit, Validator {
  @Input() minYear: number = 1800;
  private readonly currentYear = new Date().getFullYear();

  constructor(private el: ElementRef, private calendar: Calendar) {}

  ngOnInit() {
    // Set the date format
    this.calendar.dateFormat = 'dd/mm/yy';
    
    // Set calendar options
    this.calendar.yearRange = `${this.minYear}:${this.currentYear}`;
    this.calendar.minDate = new Date(this.minYear, 0, 1);
    this.calendar.maxDate = new Date(this.currentYear, 11, 31);
    
    // Optional: Set view options
    this.calendar.view = 'date'; // Can be 'date', 'month', or 'year'
    this.calendar.touchUI = true; // Set to true for mobile-friendly UI
    
    // Optional: Set other calendar configurations
    this.calendar.showButtonBar = true;
    this.calendar.showOnFocus = false;
    this.calendar.yearNavigator = true;
    this.calendar.monthNavigator = true;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Return null if date is not required
    }

    const date = new Date(control.value);
    const year = date.getFullYear();

    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }

    if (year < this.minYear) {
      return { yearTooEarly: { min: this.minYear } };
    }

    if (year > this.currentYear) {
      return { yearTooLate: { max: this.currentYear } };
    }

    return null;
  }

  getErrorMessage(control: AbstractControl): string {
    if (!control) return '';

    if (control.hasError('invalidDate')) {
      return 'Please enter a valid date.';
    }

    if (control.hasError('yearTooEarly')) {
      return `Year must not be earlier than ${this.minYear}.`;
    }

    if (control.hasError('yearTooLate')) {
      return `Year must not be later than ${this.currentYear}.`;
    }
    return '';
  }
}