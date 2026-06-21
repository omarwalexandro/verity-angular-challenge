import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { MaskDirective } from '@shared/directives';
import { email, form, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { ProfileStore } from '../profile.store';
import { ProfileService } from '../profile.service';
import { fullNamePattern } from '@shared/consts/patterns.const';
import { errorMessage } from '@shared/utils';
import type { PersonalModel } from '@shared/models/profile/profile.model';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.html',
  styleUrl: './personal.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, MaskDirective],
})
export default class Personal {
  private profileStore = inject(ProfileStore);
  private profileService = inject(ProfileService);

  personalModel = signal<PersonalModel>({
    ...this.profileStore.personal(),
    email: (this.profileStore.personal().email ?? '').toLowerCase(),
  });

  personalForm = form(this.personalModel, (schemaPath) => {
    required(schemaPath.fullName, {message: errorMessage.required});
    pattern(schemaPath.fullName, fullNamePattern, {message: errorMessage.incompleteData});
    required(schemaPath.birthDate, {message: errorMessage.required});
    minLength(schemaPath.birthDate, 10, {message: errorMessage.incompleteData});
    required(schemaPath.cpf, {message: errorMessage.required});
    minLength(schemaPath.cpf, 14, {message: errorMessage.incompleteData});
    required(schemaPath.phone, {message: errorMessage.required});
    minLength(schemaPath.phone, 14, {message: errorMessage.incompleteData});
    required(schemaPath.email, {message: errorMessage.required});
    email(schemaPath.email, {message: errorMessage.pattern});
  });

  constructor() {
    effect(() => {
      this.profileService.setStepValidity(0, !this.personalForm().invalid());
    });
  }

  protected onBlur(): void {
    const model = this.personalModel();
    const normalizedEmail = model.email?.toLowerCase() ?? '';
    if (normalizedEmail !== model.email) {
      this.personalModel.update(m => ({ ...m, email: normalizedEmail }));
    }
    this.profileStore.updatePersonal(this.personalModel());
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.personalForm().invalid()) return;
    this.profileStore.updatePersonal(this.personalModel());
    this.profileService.setStepValidity(0, true);
  }
}
