import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface StepItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class Stepper {
  steps = input.required<StepItem[]>();
  currentStepIndex = input.required<number>();
  formValid = input<boolean>(true);
  maxAccessibleStep = input<number>(Number.MAX_SAFE_INTEGER);
  stepClick = output<string>();

  protected circleClass(index: number): string {
    const base = 'w-10 h-10 rounded-full flex items-center justify-center border-1 text-sm font-semibold transition-all duration-300';
    const current = this.currentStepIndex();
    if (index < current) return `${base} bg-[var(--color-primary)] border-[var(--color-primary)] text-white`;
    if (index === current) return `${base} bg-white border-[var(--color-primary)] text-[var(--color-primary)]`;
    return `${base} bg-white border-[var(--color-gray-300)] text-[var(--color-gray-400)]`;
  }

  protected labelClass(index: number): string {
    return index <= this.currentStepIndex()
      ? 'text-xs font-medium text-center max-w-24 text-[var(--color-primary)]'
      : 'text-xs font-medium text-center max-w-24 text-[var(--color-gray-400)]';
  }

  protected leftConnectorClass(index: number): string {
    if (index === 0) return 'flex-1';
    const filled = index <= this.currentStepIndex();
    return `flex-1 h-px transition-colors duration-300 ${filled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-gray-200)]'}`;
  }

  protected rightConnectorClass(index: number, last: boolean): string {
    if (last) return 'flex-1';
    const filled = index < this.currentStepIndex();
    return `flex-1 h-px transition-colors duration-300 ${filled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-gray-200)]'}`;
  }

  protected isDisabled(index: number): boolean {
    return index > this.maxAccessibleStep() || (index === this.maxAccessibleStep() && !this.formValid());
  }
}
