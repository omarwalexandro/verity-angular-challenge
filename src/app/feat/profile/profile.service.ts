import { Injectable, computed, signal } from '@angular/core';

const FORM_STEP_COUNT = 3;

@Injectable()
export class ProfileService {
  private readonly stepValidity = signal<Record<number, boolean>>({});

  // Highest contiguous valid step starting from step 0 (-1 when step 0 is invalid).
  readonly submittedUpTo = computed(() => {
    const validity = this.stepValidity();
    let last = -1;
    for (let i = 0; validity[i]; i++) {
      last = i;
    }
    return last;
  });

  // True only when every form step is valid (used to gate the final save).
  readonly allStepsValid = computed(() => {
    const validity = this.stepValidity();
    for (let i = 0; i < FORM_STEP_COUNT; i++) {
      if (!validity[i]) return false;
    }
    return true;
  });

  isStepValid(stepIndex: number): boolean {
    return !!this.stepValidity()[stepIndex];
  }

  setStepValidity(stepIndex: number, valid: boolean): void {
    this.stepValidity.update(current => {
      if (current[stepIndex] === valid) return current;
      return { ...current, [stepIndex]: valid };
    });
  }

  reset(): void {
    this.stepValidity.set({});
  }
}
