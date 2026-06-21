import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { MaskDirective } from '@shared/directives';
import { form, FormField, required } from '@angular/forms/signals';
import { ProfileStore } from '../profile.store';
import { ProfileService } from '../profile.service';
import { ProfessionApiService } from '@core/services/profession-api.service';
import { errorMessage } from '@shared/utils';
import type { ProfessionalModel } from '@shared/models/profile/profile.model';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.html',
  styleUrl: './professional.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, MaskDirective],
})
export default class Professional {
  private profileStore = inject(ProfileStore);
  private profileService = inject(ProfileService);
  private professionApiService = inject(ProfessionApiService);
  professionalModel = signal<ProfessionalModel>(this.profileStore.professional());
  private professionsResource = this.professionApiService.getProfessions();
  protected professions = computed(() => this.professionsResource.value() ?? []);

  professionalForm = form(this.professionalModel, (schemaPath) => {
    required(schemaPath.profession, {message: errorMessage.required});
    required(schemaPath.company, {message: errorMessage.required});
    required(schemaPath.salary, {message: errorMessage.required});
  });

  constructor() {
    effect(() => {
      this.profileService.setStepValidity(2, !this.professionalForm().invalid());
    });
  }

  protected onBlur(): void {
    this.profileStore.updateProfessional(this.professionalModel());
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.professionalForm().invalid()) return;
    this.profileStore.updateProfessional(this.professionalModel());
    this.profileService.setStepValidity(2, true);
  }
}
