import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, UrlTree, provideRouter } from '@angular/router';
import { ProfileService } from './profile.service';
import { stepGuard } from './step.guard';

describe('stepGuard', () => {
  let profileService: ProfileService;
  let router: Router;

  const createGuardContext = () => {
    const route = TestBed.inject(ActivatedRoute);
    return { route };
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileService, provideRouter([])],
    });
    profileService = TestBed.inject(ProfileService);
    router = TestBed.inject(Router);
  });

  it('allows navigation to step 0 (personal) always', () => {
    const guard = stepGuard(0);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('allows navigation to step 1 when step 0 is valid', () => {
    profileService.setStepValidity(0, true);
    const guard = stepGuard(1);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to step 0 when trying to reach step 1 without step 0 valid', () => {
    const guard = stepGuard(1);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBeInstanceOf(UrlTree);
  });

  it('allows step 2 when steps 0 and 1 are valid', () => {
    profileService.setStepValidity(0, true);
    profileService.setStepValidity(1, true);
    const guard = stepGuard(2);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('allows step 3 (review) when all steps 0–2 are valid', () => {
    profileService.setStepValidity(0, true);
    profileService.setStepValidity(1, true);
    profileService.setStepValidity(2, true);
    const guard = stepGuard(3);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects when trying to skip to review without completing all steps', () => {
    profileService.setStepValidity(0, true);
    const guard = stepGuard(3);
    const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
    expect(result).toBeInstanceOf(UrlTree);
  });
});
