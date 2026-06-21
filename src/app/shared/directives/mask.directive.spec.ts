import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaskDirective } from './mask.directive';

// Separate static host components so the signal input is set from the start
@Component({ template: `<input appMask="000.000.000-00" />`, imports: [MaskDirective] })
class CpfHost {}

@Component({ template: `<input appMask="00/00/0000" />`, imports: [MaskDirective] })
class DateHost {}

@Component({ template: `<input appMask="00000-000" />`, imports: [MaskDirective] })
class CepHost {}

@Component({ template: `<input appMask="phone" />`, imports: [MaskDirective] })
class PhoneHost {}

@Component({ template: `<input appMask="currency" />`, imports: [MaskDirective] })
class CurrencyHost {}

function fireInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function setupFixture<T>(HostClass: new () => T): { fixture: ComponentFixture<T>; input: HTMLInputElement } {
  const fixture = TestBed.createComponent(HostClass) as ComponentFixture<T>;
  fixture.detectChanges();
  const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
  return { fixture, input };
}

describe('MaskDirective', () => {
  describe('CPF mask (000.000.000-00)', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [CpfHost] }).compileComponents();
      ({ input } = setupFixture(CpfHost));
    });

    it('applies CPF mask to numeric input', () => {
      fireInput(input, '12345678900');
      expect(input.value).toBe('123.456.789-00');
    });

    it('strips non-numeric characters before masking', () => {
      fireInput(input, '123abc456def789gh00');
      expect(input.value).toBe('123.456.789-00');
    });

    it('handles partial CPF input', () => {
      fireInput(input, '123');
      expect(input.value).toBe('123');
    });

    it('returns empty string for empty input', () => {
      fireInput(input, '');
      expect(input.value).toBe('');
    });
  });

  describe('date mask (00/00/0000)', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [DateHost] }).compileComponents();
      ({ input } = setupFixture(DateHost));
    });

    it('applies date mask', () => {
      fireInput(input, '01011990');
      expect(input.value).toBe('01/01/1990');
    });

    it('handles partial date', () => {
      fireInput(input, '0101');
      expect(input.value).toBe('01/01');
    });
  });

  describe('CEP mask (00000-000)', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [CepHost] }).compileComponents();
      ({ input } = setupFixture(CepHost));
    });

    it('applies CEP mask', () => {
      fireInput(input, '60000000');
      expect(input.value).toBe('60000-000');
    });

    it('handles partial CEP', () => {
      fireInput(input, '600');
      expect(input.value).toBe('600');
    });
  });

  describe('phone mask', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [PhoneHost] }).compileComponents();
      ({ input } = setupFixture(PhoneHost));
    });

    it('applies landline format for 10 digits', () => {
      fireInput(input, '8540163243');
      expect(input.value).toBe('(85) 4016-3243');
    });

    it('applies mobile format for 11 digits', () => {
      fireInput(input, '85981998417');
      expect(input.value).toBe('(85) 98199-8417');
    });

    it('returns empty for empty input', () => {
      fireInput(input, '');
      expect(input.value).toBe('');
    });

    it('handles partial phone (fewer than 10 digits)', () => {
      fireInput(input, '85');
      expect(input.value).toContain('85');
    });
  });

  describe('currency mask', () => {
    let input: HTMLInputElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({ imports: [CurrencyHost] }).compileComponents();
      ({ input } = setupFixture(CurrencyHost));
    });

    it('formats value as BRL currency (starts with R$)', () => {
      fireInput(input, '1000');
      expect(input.value).toMatch(/^R\$\s/);
      expect(input.value).toContain('10');
    });

    it('formats large values (contains R$ prefix)', () => {
      fireInput(input, '1000000');
      expect(input.value).toMatch(/^R\$\s/);
      expect(input.value).toContain('10');
    });

    it('returns empty string for empty input', () => {
      fireInput(input, '');
      expect(input.value).toBe('');
    });

    it('strips non-numeric characters before formatting', () => {
      fireInput(input, 'abc');
      expect(input.value).toBe('');
    });
  });
});
