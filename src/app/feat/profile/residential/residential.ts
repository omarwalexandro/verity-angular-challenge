import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, untracked } from '@angular/core';
import { MaskDirective } from '@shared/directives';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { ProfileStore } from '../profile.store';
import { ProfileService } from '../profile.service';
import { errorMessage } from '@shared/utils';
import { CepService } from '@core/services/cep.service';
import { StateApiService } from '@core/services/state-api.service';
import type { ResidentialModel } from '@shared/models/profile/profile.model';

@Component({
  selector: 'app-residential',
  templateUrl: './residential.html',
  styleUrl: './residential.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FormField, MaskDirective],
})
export default class Residential {
  private profileStore = inject(ProfileStore);
  private profileService = inject(ProfileService);
  private cepService = inject(CepService);
  private stateApiService = inject(StateApiService);
  residentialModel = signal<ResidentialModel>(this.profileStore.residential());
  private cepSignal = signal('');
  private statesResource = this.stateApiService.getStates();
  private cepResource = this.cepService.getCep(this.cepSignal);
  protected states = computed(() => this.statesResource.value() ?? []);
  protected cepError = signal<string | null>(null);

  residentialForm = form(this.residentialModel, (schemaPath) => {
    required(schemaPath.address, {message: errorMessage.required});
    required(schemaPath.city, {message: errorMessage.required});
    required(schemaPath.state, {message: errorMessage.required});
    required(schemaPath.zipCode, {message: errorMessage.required});
    minLength(schemaPath.zipCode, 9, {message: errorMessage.incompleteData});
  });

  constructor() {
    effect(() => {
      this.profileService.setStepValidity(1, !this.residentialForm().invalid());
    });

    effect(() => {
      const data = this.cepResource.value();
      const error = this.cepResource.error();

      if (error) {
        this.cepError.set('Não foi possível consultar o CEP. Tente novamente.');
        return;
      }

      if (data?.erro) {
        this.cepError.set('CEP não encontrado.');
        return;
      }

      if (data) {
        this.cepError.set(null);
        this.residentialModel.update(current => ({
          ...current,
          address: data.logradouro ?? '',
          district: data.bairro ?? '',
          city: data.localidade ?? '',
          state: data.uf ?? '',
        }));
        this.profileStore.updateResidential(untracked(() => this.residentialModel()));
      }
    });
  }

  protected onBlur(): void {
    this.profileStore.updateResidential(this.residentialModel());
  }

  protected onCepBlur(): void {
    const cep = this.residentialModel().zipCode;
    if (cep && cep.length === 9) {
      this.cepError.set(null);
      this.cepSignal.set(cep);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.residentialForm().invalid()) return;
    this.profileStore.updateResidential(this.residentialModel());
    this.profileService.setStepValidity(1, true);
  }
}
