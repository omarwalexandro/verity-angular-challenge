import { Directive, ElementRef, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appMask]',
  standalone: true,
})
export class MaskDirective {
  appMask = input.required<string>();

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    const value = input.value;
    const mask = this.appMask();

    const masked = this.applyMask(value, mask);
    if (masked !== value) {
      input.value = masked;
      // Dispatch input event so [formField] picks up the change
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  private applyMask(value: string, mask: string): string {
    // Handle currency mask with separators
    if (mask === 'currency') {
      return this.applyCurrencyMask(value);
    }

    // Handle adaptive phone mask
    if (mask === 'phone') {
      return this.applyPhoneMask(value);
    }

    // Standard mask with '0' placeholders
    const cleanValue = value.replace(/\D/g, '');
    let masked = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < cleanValue.length; i++) {
      const maskChar = mask[i];
      if (maskChar === '0') {
        masked += cleanValue[valueIndex];
        valueIndex++;
      } else {
        masked += maskChar;
      }
    }

    return masked;
  }

  private applyPhoneMask(value: string): string {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 0) return '';

    // Old format: (00) 0000-0000 (10 digits)
    // New format: (00) 00000-0000 (11 digits)
    if (cleanValue.length <= 10) {
      // Format as (00) 0000-0000
      const parts = [
        cleanValue.slice(0, 2),
        cleanValue.slice(2, 6),
        cleanValue.slice(6, 10)
      ].filter(Boolean);
      return `(${parts[0]}) ${parts[1] || ''}${parts[2] ? '-' + parts[2] : ''}`;
    } else {
      // Format as (00) 00000-0000
      const parts = [
        cleanValue.slice(0, 2),
        cleanValue.slice(2, 7),
        cleanValue.slice(7, 11)
      ].filter(Boolean);
      return `(${parts[0]}) ${parts[1] || ''}${parts[2] ? '-' + parts[2] : ''}`;
    }
  }

  private applyCurrencyMask(value: string): string {
    // Remove all non-numeric characters
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue === '') return '';

    // Convert to number and format as Brazilian currency
    const num = parseInt(cleanValue, 10) / 100;
    return 'R$ ' + num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
