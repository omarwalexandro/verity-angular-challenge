import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { STEPS } from '@shared/consts/steps.const';

export const stepGuard = (stepIndex: number): CanActivateFn => (route: ActivatedRouteSnapshot) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  const maxAccessible = profileService.submittedUpTo() + 1;
  if (stepIndex <= maxAccessible) return true;

  const id = route.parent?.paramMap.get('id') || 'new';
  const safeIndex = Math.min(maxAccessible, STEPS.length - 1);
  return router.createUrlTree(['/profile', id, STEPS[safeIndex].route]);
};
