/*-----------------------------------How to Use it in component--------------------------------------*/
// <input type="text"  appDecimalNumber [maxLength]="6"  formControlName="pinCode">
/*--------------------------------------------------------------------------------------------------*/
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]',
  standalone: false
})
export class OnlyNumbersDirective {
  @Input() maxLength: number = 100; // Default to 100
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, '');
    input.value = sanitized.substring(0, this.maxLength);
    
    if (input.value !== sanitized) {
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
    
    const input = event.target as HTMLInputElement;
    if (input.value.length >= this.maxLength) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const sanitized = clipboardData.replace(/[^0-9]/g, '').substring(0, this.maxLength);
    
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = sanitized;
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }
}