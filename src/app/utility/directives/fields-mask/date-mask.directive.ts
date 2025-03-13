import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: '[dateInputMask]',
    host: {
        '(input)': 'onHostInputChange($event)'
        // Removed '(keydown.backspace)': 'onBackspace($event)' to avoid duplicate handling
    }
})
export class DateInputMaskDirective {
    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        // Find the input element in the p-calendar
        const inputElement = this.el.nativeElement.querySelector('input');
        if (inputElement) {
            // Attach event listeners
            inputElement.addEventListener('input', this.onInputChange.bind(this, inputElement));
            inputElement.addEventListener('keydown', (event: KeyboardEvent) => {
                if (event.key === 'Backspace') {
                    this.onBackspace(event, inputElement);
                }
            });
        }
    }

    // Handle input events coming from the host binding
    onHostInputChange(event: Event): void {
        // If it's the original input element (not from p-calendar), handle directly
        if (event.target === this.el.nativeElement) {
            this.onInputChange(this.el.nativeElement, event);
        }
    }

    onInputChange(inputElement: HTMLInputElement, event: Event): void {
        const input = inputElement.value;
        const trimmed = input.replace(/\D/g, '');
        let formatted = '';
        if (trimmed.length > 0) {
            formatted += trimmed.substring(0, Math.min(2, trimmed.length));

            if (trimmed.length > 2) {
                formatted += '/' + trimmed.substring(2, Math.min(4, trimmed.length));

                if (trimmed.length > 4) {
                    formatted += '/' + trimmed.substring(4, Math.min(8, trimmed.length));
                }
            }
        }
        inputElement.value = formatted;

        // Trigger change event - but only if not directly from an input event
        // to avoid infinite loops
        if (event.type !== 'input') {
            const inputEvent = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(inputEvent);
        }
    }

    onBackspace(event: KeyboardEvent, inputElement: HTMLInputElement): void {
        const input = inputElement.value;
        const caretPos = inputElement.selectionStart || 0;
        
        // If caret is after a slash, we want to remove the slash and the digit before it
        if (caretPos > 0 && input.charAt(caretPos - 1) === '/') {
            inputElement.value = input.substring(0, caretPos - 1) + input.substring(caretPos);
            inputElement.setSelectionRange(caretPos - 1, caretPos - 1);
            event.preventDefault();
        } 
        // When the input ends with a slash and backspace is pressed
        else if (input.endsWith('/') && caretPos === input.length) {
            inputElement.value = input.slice(0, -1);
            event.preventDefault();
        }
        // For normal backspace when not at a slash boundary, let the default behavior work
        // and then reformat afterwards
        else {
            // Let the default backspace happen, then reformat on the next tick
            setTimeout(() => {
                this.onInputChange(inputElement, new Event('backspace'));
                
                // Position cursor properly after reformatting
                const newValue = inputElement.value;
                let newPos = caretPos - 1;
                if (newPos < 0) newPos = 0;
                
                // Adjust cursor position if we're at a slash position
                if (newValue.charAt(newPos) === '/') {
                    newPos = Math.max(0, newPos - 1);
                }
                
                inputElement.setSelectionRange(newPos, newPos);
            }, 0);
        }
    }
}