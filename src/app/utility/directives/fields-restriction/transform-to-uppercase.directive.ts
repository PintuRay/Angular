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

    // Trigger input event to ensure Angular's two-way binding is updated
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const pattern = /[A-Za-z\s]/;
    const inputChar = String.fromCharCode(event.keyCode || event.which);

    // Allow backspace, delete, arrow keys, and other control keys
    if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Tab') {
      return; // Allow these keys
    }

    // Prevent non-alphabetic characters
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

    // Trigger input event to ensure Angular's two-way binding is updated
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }
}