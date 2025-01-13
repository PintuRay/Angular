import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[transformToUppercase]',
  standalone: false,
})
export class TransformToUppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^A-Za-z\s]/g, '').toUpperCase();
    input.value = sanitized;
    // Trigger input event if value was changed
    if (input.value !== sanitized) {
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
    }
  }
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const pattern = /[A-Za-z\s]/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const sanitized = clipboardData.replace(/[^A-Za-z\s]/g, '').toUpperCase();
    
    const input = this.el.nativeElement as HTMLInputElement;
    input.value = sanitized;
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }
}