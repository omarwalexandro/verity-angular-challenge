import { Component, ChangeDetectionStrategy, inject, computed, signal, effect, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith, take } from 'rxjs';
import { ProfileStore } from './profile.store';
import { ProfileService } from './profile.service';
import { ProfileApiService } from '@core/services/profile-api.service';
import { STEPS } from '@shared/consts/steps.const';
import { Stepper } from '@shared/ui/stepper/stepper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterOutlet, Stepper],
})
export default class Profile implements OnInit {
  protected profileStore = inject(ProfileStore);
  protected profileService = inject(ProfileService);
  private profileApiService = inject(ProfileApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected steps = STEPS;
  protected isSaving = signal(false);
  protected isLoading = signal(false);
  private profileId = signal<string | null>(null);
  private profileHandled = signal(false);
  private profileResource = this.profileApiService.getProfile(this.profileId);

  constructor() {
    effect(() => {
      if (!this.profileId() || this.profileHandled()) return;
      if (this.profileResource.isLoading()) return;

      const profile = this.profileResource.value();
      const error = this.profileResource.error();

      if (profile !== undefined) {
        this.profileHandled.set(true);
        this.profileStore.loadProfile(profile);
        // A persisted profile has already passed every step's validation.
        this.profileService.setStepValidity(0, true);
        this.profileService.setStepValidity(1, true);
        this.profileService.setStepValidity(2, true);
        this.isLoading.set(false);
        this.router.navigate(['review'], { relativeTo: this.route });
      } else if (error !== undefined) {
        this.profileHandled.set(true);
        this.isLoading.set(false);
        console.error('Error loading profile:', error);
        this.router.navigate(['/home']);
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isLoading.set(true);
      this.profileId.set(id);
    }
  }

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).url),
      startWith(this.router.url)
    )
  );

  protected currentStepIndex = computed(() => {
    const segments = (this.currentUrl() ?? '').split('/');
    const idx = STEPS.findIndex(s => segments.includes(s.route));
    return idx === -1 ? 0 : idx;
  });

  protected isFeedbackPage = computed(() => {
    const url = this.currentUrl() ?? '';
    return url.includes('feedback');
  });

  protected maxAccessibleStep = computed(() => this.profileService.submittedUpTo() + 1);
  protected isFirstStep = computed(() => this.currentStepIndex() === 0);
  protected isLastStep = computed(() => this.currentStepIndex() === STEPS.length - 1);
  // Validity of the form currently on screen (gates the "Próximo" button).
  protected isFormValid = computed(() => this.profileService.isStepValid(this.currentStepIndex()));
  // Every form step is valid (gates the final "Finalizar" save).
  protected canSave = computed(() => this.profileService.allStepsValid());

  protected onStepClick(route: string): void {
    const stepIndex = STEPS.findIndex(s => s.route === route);
    // Only allow navigation to steps whose preceding steps are all valid.
    if (stepIndex <= this.maxAccessibleStep()) {
      const id = this.route.snapshot.paramMap.get('id');
      this.router.navigateByUrl(`/profile/${id}/${route}`);
    }
  }

  protected goNext(): void {
    // Trigger blur on active element to ensure form data is saved
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const next = STEPS[this.currentStepIndex() + 1];
    if (next) {
      const id = this.route.snapshot.paramMap.get('id');
      this.router.navigateByUrl(`/profile/${id}/${next.route}`);
    }
  }

  protected goPrev(): void {
    // Trigger blur on active element to ensure form data is saved
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const prev = STEPS[this.currentStepIndex() - 1];
    if (prev) {
      const id = this.route.snapshot.paramMap.get('id');
      this.router.navigateByUrl(`/profile/${id}/${prev.route}`);
    }
  }

  protected saveProfile(): void {
    // Safety net: never persist a profile while any step is invalid.
    if (!this.profileService.allStepsValid()) return;
    this.isSaving.set(true);
    const profile = this.profileStore.profileModel();
    const id = profile.id;

    const request = id
      ? this.profileApiService.updateProfile(id, profile)
      : this.profileApiService.createProfile(profile);

    request
      .pipe(take(1))
      .subscribe({
        next: (savedProfile) => {
          this.isSaving.set(false);
          console.log('Profile saved successfully:', savedProfile);
          // Reset forms after successful save
          this.profileStore.reset();
          this.profileService.reset();
          this.router.navigate(['feedback'], { 
            relativeTo: this.route,
            queryParams: { success: 'true', message: 'Perfil salvo com sucesso!' }
          });
        },
        error: (error) => {
          this.isSaving.set(false);
          console.error('Error saving profile:', error);
          this.router.navigate(['feedback'], {
            relativeTo: this.route,
            queryParams: { success: 'false', message: 'Erro ao salvar perfil. Tente novamente.' }
          });
        }
      });
  }
}
