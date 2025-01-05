import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[transformToUppercase]',
  standalone: false,
})
export class TransformToUppercaseDirective {
  constructor(private el: ElementRef) {}
  @HostListener('input', ['$event']) onInputChange(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const originalValue = inputElement.value;
    const newValue = originalValue.toUpperCase();
    if (originalValue !== newValue) {
      inputElement.value = newValue;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent): void {
    const clipboardData =
      event.clipboardData || (window as any)['clipboardData'];
    const pastedData = clipboardData.getData('text');
    event.preventDefault();
    const transformedData = pastedData.toUpperCase();
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const start = inputElement.selectionStart ?? 0;
    const end = inputElement.selectionEnd ?? 0;
    inputElement.value =
      inputElement.value.substring(0, start) +
      transformedData +
      inputElement.value.substring(end);
    inputElement.setSelectionRange(
      start + transformedData.length,
      start + transformedData.length
    );
    inputElement.dispatchEvent(new Event('input'));
  }
}