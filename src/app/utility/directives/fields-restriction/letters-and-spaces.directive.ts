import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[LettersAndSpaces]',
  standalone: false,
})
export class LettersAndSpacesDirective {
  constructor(private el: ElementRef) {}
  private readonly allowedCharacterPattern: RegExp = /^[a-zA-Z\s]*$/;
  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent): void {
    const key = event.key;
    if (!this.allowedCharacterPattern.test(key)) {
      event.preventDefault(); 
    }
  }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const originalValue = inputElement.value;
    const newValue = originalValue.replace(/[^a-zA-Z\s]/g, '');
    if (originalValue !== newValue) {
      inputElement.value = newValue;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}