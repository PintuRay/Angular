import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]',
  standalone: false
})
export class OnlyNumbersDirective {
  constructor() { }
  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    const isNumber = /^[0-9]$/.test(key);
    if (!isNumber) {
      event.preventDefault();
    }
  }
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData || (window as any)['clipboardData'];
    const pastedData = clipboardData.getData('text');
    if (!/^\d+$/.test(pastedData)) {
      event.preventDefault(); 
    }
  }
}