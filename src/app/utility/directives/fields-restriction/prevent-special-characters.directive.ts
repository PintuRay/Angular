import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[preventSpecialCharacters]',
  standalone: false
})
export class PreventSpecialCharactersDirective {
  constructor(private el: ElementRef) { }
  private readonly specialCharacterPattern: RegExp = /[$&+,:;=?@#|'<>.\-^*()%!]/;
  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent): void {
    if (this.specialCharacterPattern.test(event.key)) {
      event.preventDefault();
    }
  }
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const originalValue = inputElement.value;
    const newValue = originalValue.replace(this.specialCharacterPattern, '');
    if (originalValue !== newValue) {
      inputElement.value = newValue;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}