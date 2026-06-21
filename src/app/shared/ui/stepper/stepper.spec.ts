import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Stepper, StepItem } from './stepper';

const MOCK_STEPS: StepItem[] = [
  { label: 'Dados Pessoais', route: 'personal' },
  { label: 'Dados Residenciais', route: 'residential' },
  { label: 'Dados Profissionais', route: 'professional' },
  { label: 'Revisão Dados', route: 'review' },
];

describe('Stepper', () => {
  let fixture: ComponentFixture<Stepper>;
  let component: Stepper;

  function createStepper(currentStepIndex = 0, maxAccessibleStep = 0, formValid = true): void {
    fixture = TestBed.createComponent(Stepper);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('steps', MOCK_STEPS);
    fixture.componentRef.setInput('currentStepIndex', currentStepIndex);
    fixture.componentRef.setInput('maxAccessibleStep', maxAccessibleStep);
    fixture.componentRef.setInput('formValid', formValid);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Stepper] }).compileComponents();
  });

  it('should create', () => {
    createStepper();
    expect(component).toBeTruthy();
  });

  it('renders the correct number of steps', () => {
    createStepper();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(MOCK_STEPS.length);
  });

  it('renders step labels', () => {
    createStepper();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Dados Pessoais');
    expect(text).toContain('Revisão Dados');
  });

  describe('circleClass', () => {
    it('returns primary bg for a completed step (index < currentStepIndex)', () => {
      createStepper(2);
      // step 0 is completed when currentStepIndex === 2
      const cls = (component as any).circleClass(0);
      expect(cls).toContain('bg-[var(--color-primary)]');
      expect(cls).toContain('text-white');
    });

    it('returns white bg with primary border for the current step', () => {
      createStepper(1);
      const cls = (component as any).circleClass(1);
      expect(cls).toContain('bg-white');
      expect(cls).toContain('border-[var(--color-primary)]');
      expect(cls).toContain('text-[var(--color-primary)]');
    });

    it('returns gray border for a future step', () => {
      createStepper(0);
      const cls = (component as any).circleClass(3);
      expect(cls).toContain('border-[var(--color-gray-300)]');
      expect(cls).toContain('text-[var(--color-gray-400)]');
    });
  });

  describe('labelClass', () => {
    it('returns primary colour for current and past steps', () => {
      createStepper(2);
      expect((component as any).labelClass(0)).toContain('text-[var(--color-primary)]');
      expect((component as any).labelClass(2)).toContain('text-[var(--color-primary)]');
    });

    it('returns gray for future steps', () => {
      createStepper(1);
      expect((component as any).labelClass(3)).toContain('text-[var(--color-gray-400)]');
    });
  });

  describe('leftConnectorClass', () => {
    it('returns "flex-1" for the first step (index 0)', () => {
      createStepper(0);
      expect((component as any).leftConnectorClass(0)).toBe('flex-1');
    });

    it('returns primary bg for a filled connector', () => {
      createStepper(2);
      const cls = (component as any).leftConnectorClass(2);
      expect(cls).toContain('bg-[var(--color-primary)]');
    });

    it('returns gray bg for an unfilled connector', () => {
      createStepper(0);
      const cls = (component as any).leftConnectorClass(2);
      expect(cls).toContain('bg-[var(--color-gray-200)]');
    });
  });

  describe('rightConnectorClass', () => {
    it('returns "flex-1" for the last step', () => {
      createStepper(0);
      expect((component as any).rightConnectorClass(3, true)).toBe('flex-1');
    });

    it('returns primary bg when step index < currentStepIndex', () => {
      createStepper(3);
      const cls = (component as any).rightConnectorClass(0, false);
      expect(cls).toContain('bg-[var(--color-primary)]');
    });

    it('returns gray when step index >= currentStepIndex', () => {
      createStepper(0);
      const cls = (component as any).rightConnectorClass(1, false);
      expect(cls).toContain('bg-[var(--color-gray-200)]');
    });
  });

  describe('isDisabled', () => {
    it('returns false for steps within the accessible range', () => {
      createStepper(0, 2);
      expect((component as any).isDisabled(0)).toBe(false);
      expect((component as any).isDisabled(1)).toBe(false);
    });

    it('returns true for steps beyond maxAccessibleStep', () => {
      createStepper(0, 1);
      expect((component as any).isDisabled(2)).toBe(true);
    });

    it('returns true for maxAccessibleStep when form is not valid', () => {
      createStepper(0, 1, false);
      expect((component as any).isDisabled(1)).toBe(true);
    });

    it('returns false for maxAccessibleStep when form is valid', () => {
      createStepper(0, 1, true);
      expect((component as any).isDisabled(1)).toBe(false);
    });
  });

  describe('stepClick output', () => {
    it('emits the step route when a non-disabled step button is clicked', () => {
      createStepper(0, 3, true);
      const emitted: string[] = [];
      component.stepClick.subscribe((route: string) => emitted.push(route));

      const buttons = fixture.nativeElement.querySelectorAll('button');
      buttons[0].click();
      expect(emitted).toContain('personal');
    });
  });
});
