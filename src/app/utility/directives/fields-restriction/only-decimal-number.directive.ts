/*-----------------------------------How to Use it in component--------------------------------------*/
// <input type="text"  appDecimalNumber [maxLength]="6" [decimalPlaces]="2" formControlName="amount">
/*--------------------------------------------------------------------------------------------------*/
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyDecimalNumber]'
})
export class OnlyDecimalNumberDirective {
    private _maxLength: number = 10;
    private _decimalPlaces: number = 2;
    private regex: RegExp = new RegExp(`^\\d{0,${this._maxLength}}(\\.\\d{0,${this._decimalPlaces}})?$`);

    @Input()
    set maxLength(value: number) {
        this._maxLength = Math.max(1, Math.floor(Math.abs(value))) || 10;
        this.updateRegex();
    }
    get maxLength(): number {
        return this._maxLength;
    }
    @Input()
    set decimalPlaces(value: number) {
        this._decimalPlaces = Math.max(0, Math.floor(Math.abs(value))) || 2;
        this.updateRegex();
    }
    get decimalPlaces(): number {
        return this._decimalPlaces;
    }

    constructor(private el: ElementRef) { }

    private updateRegex(): void {
        this.regex = new RegExp(`^\\d{0,${this._maxLength}}(\\.\\d{0,${this._decimalPlaces}})?$`);
    }

    @HostListener('input', ['$event'])
    onInputChange(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        // Remove any characters that aren't numbers or decimal point
        value = value.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Apply regex to enforce maxLength and decimalPlaces
        if (this.regex.test(value)) {
            input.value = value;
        } else {
            // If value doesn't match regex, try to fix it
            const numParts = value.split('.');
            if (numParts.length === 1) {
                // No decimal point - just trim to maxLength
                input.value = numParts[0].substring(0, this._maxLength);
            } else {
                // Has decimal point - trim both parts
                input.value = numParts[0].substring(0, this._maxLength) +
                    '.' +
                    numParts[1].substring(0, this._decimalPlaces);
            }
        }

        // Dispatch input event if value was changed
        if (input.value !== value) {
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
        }
    }

    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent) {
        const input = event.target as HTMLInputElement;
        const current = input.value;
        const next = current.concat(event.key);
        const pattern = /[\d.]/;

        // Only allow digits and decimal point
        if (!pattern.test(event.key)) {
            event.preventDefault();
            return;
        }

        // Prevent multiple decimal points
        if (event.key === '.' && current.includes('.')) {
            event.preventDefault();
            return;
        }

        // Check if next value would match our regex
        if (!this.regex.test(next)) {
            event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const clipboardData = event.clipboardData?.getData('text') || '';

        // Remove any invalid characters
        let sanitized = clipboardData.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const parts = sanitized.split('.');
        if (parts.length > 2) {
            sanitized = parts[0] + '.' + parts.slice(1).join('');
        }

        // Apply maxLength and decimalPlaces constraints
        if (parts.length === 1) {
            sanitized = parts[0].substring(0, this._maxLength);
        } else {
            sanitized = parts[0].substring(0, this._maxLength) +
                '.' +
                parts[1].substring(0, this._decimalPlaces);
        }

        const input = this.el.nativeElement as HTMLInputElement;
        input.value = sanitized;
        const inputEvent = new Event('input', { bubbles: true });
        input.dispatchEvent(inputEvent);
    }
}