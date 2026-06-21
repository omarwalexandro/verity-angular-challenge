import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ProfileService] });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isStepValid', () => {
    it('returns false for a step that has not been set', () => {
      expect(service.isStepValid(0)).toBe(false);
    });

    it('returns true after setStepValidity(n, true)', () => {
      service.setStepValidity(0, true);
      expect(service.isStepValid(0)).toBe(true);
    });

    it('returns false after setStepValidity(n, false)', () => {
      service.setStepValidity(0, true);
      service.setStepValidity(0, false);
      expect(service.isStepValid(0)).toBe(false);
    });
  });

  describe('submittedUpTo', () => {
    it('returns -1 when no steps are valid', () => {
      expect(service.submittedUpTo()).toBe(-1);
    });

    it('returns 0 when only step 0 is valid', () => {
      service.setStepValidity(0, true);
      expect(service.submittedUpTo()).toBe(0);
    });

    it('returns 1 when steps 0 and 1 are valid', () => {
      service.setStepValidity(0, true);
      service.setStepValidity(1, true);
      expect(service.submittedUpTo()).toBe(1);
    });

    it('does not count non-contiguous valid steps', () => {
      service.setStepValidity(0, true);
      service.setStepValidity(2, true);
      // Step 1 is invalid, so the contiguous chain stops at 0
      expect(service.submittedUpTo()).toBe(0);
    });
  });

  describe('allStepsValid', () => {
    it('returns false when no steps are valid', () => {
      expect(service.allStepsValid()).toBe(false);
    });

    it('returns false when only some steps are valid', () => {
      service.setStepValidity(0, true);
      service.setStepValidity(1, true);
      expect(service.allStepsValid()).toBe(false);
    });

    it('returns true when all 3 steps are valid', () => {
      service.setStepValidity(0, true);
      service.setStepValidity(1, true);
      service.setStepValidity(2, true);
      expect(service.allStepsValid()).toBe(true);
    });

    it('returns false again after reset', () => {
      service.setStepValidity(0, true);
      service.setStepValidity(1, true);
      service.setStepValidity(2, true);
      service.reset();
      expect(service.allStepsValid()).toBe(false);
    });
  });

  describe('reset', () => {
    it('clears all step validity', () => {
      service.setStepValidity(0, true);
      service.setStepValidity(1, true);
      service.reset();
      expect(service.isStepValid(0)).toBe(false);
      expect(service.isStepValid(1)).toBe(false);
      expect(service.submittedUpTo()).toBe(-1);
    });
  });
});
