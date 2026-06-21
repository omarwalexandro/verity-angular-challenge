import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import Profile from './profile';
import { ProfileStore } from './profile.store';
import { ProfileService } from './profile.service';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let router: Router;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        ProfileStore,
        ProfileService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the router-outlet', () => {
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });

  it('shows stepper when not on feedback page', () => {
    expect(fixture.nativeElement.querySelector('app-stepper')).toBeTruthy();
  });

  it('shows Next button when not on last step', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Próximo');
  });

  describe('computed signals', () => {
    it('isFirstStep is true when currentStepIndex is 0', () => {
      expect((component as any).isFirstStep()).toBe(true);
    });

    it('isFeedbackPage is false on non-feedback URL', () => {
      expect((component as any).isFeedbackPage()).toBe(false);
    });

    it('maxAccessibleStep starts at 0 when no steps are valid', () => {
      const svc = TestBed.inject(ProfileService);
      svc.reset();
      expect((component as any).maxAccessibleStep()).toBe(0);
    });

    it('canSave is false when not all steps are valid', () => {
      expect((component as any).canSave()).toBe(false);
    });

    it('canSave is true when all steps are valid', () => {
      const svc = TestBed.inject(ProfileService);
      svc.setStepValidity(0, true);
      svc.setStepValidity(1, true);
      svc.setStepValidity(2, true);
      expect((component as any).canSave()).toBe(true);
    });
  });

  describe('goNext', () => {
    it('navigates to next step URL', () => {
      const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      (component as any).goNext();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('goPrev', () => {
    it('does not navigate when already on first step (no prev step)', () => {
      const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      (component as any).goPrev();
      // No prev from step 0 — navigateByUrl should NOT be called
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('onStepClick', () => {
    it('navigates when stepIndex is within accessible range', () => {
      const svc = TestBed.inject(ProfileService);
      svc.setStepValidity(0, true);
      const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      (component as any).onStepClick('personal');
      expect(spy).toHaveBeenCalled();
    });

    it('does not navigate when stepIndex exceeds accessible range', () => {
      const spy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
      (component as any).onStepClick('review');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('saveProfile', () => {
    it('does nothing when not all steps are valid', () => {
      const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      (component as any).saveProfile();
      httpMock.expectNone('http://localhost:3000/profiles');
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls createProfile when all steps are valid and no id', () => {
      vi.spyOn(router, 'navigate').mockResolvedValue(true);

      const svc = TestBed.inject(ProfileService);
      svc.setStepValidity(0, true);
      svc.setStepValidity(1, true);
      svc.setStepValidity(2, true);

      const store = TestBed.inject(ProfileStore);
      store.reset();

      (component as any).saveProfile();

      const req = httpMock.expectOne('http://localhost:3000/profiles');
      expect(req.request.method).toBe('POST');
      req.flush({ id: 'new-id', personal: {}, residential: {}, professional: {} });
    });

    it('calls updateProfile when all steps are valid and an id is present', () => {
      vi.spyOn(router, 'navigate').mockResolvedValue(true);

      const svc = TestBed.inject(ProfileService);
      svc.setStepValidity(0, true);
      svc.setStepValidity(1, true);
      svc.setStepValidity(2, true);

      const store = TestBed.inject(ProfileStore);
      store.setId('abc-123');

      (component as any).saveProfile();

      const req = httpMock.expectOne('http://localhost:3000/profiles/abc-123');
      expect(req.request.method).toBe('PUT');
      req.flush({ id: 'abc-123', personal: {}, residential: {}, professional: {} });
    });
  });
});
