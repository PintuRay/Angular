import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[PreventNumbers]',
  standalone: false
})
export class PreventNumbersDirective {
  constructor() { }
  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    const key = event.key; 
    const isNumber = /^[0-9]$/.test(key); 
    if (isNumber) {
      event.preventDefault(); 
    }
  }
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any)['clipboardData'];
    const pastedData = clipboardData.getData('text/plain');
    if (/\d/.test(pastedData)) {
      event.preventDefault(); // Prevent pasting if it contains numbers
    }
  }
}