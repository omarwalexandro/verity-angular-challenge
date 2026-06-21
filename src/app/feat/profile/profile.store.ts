import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import type { PersonalModel, ProfessionalModel, ProfileModel, ResidentialModel } from '@shared/models/profile/profile.model';

const initialState: ProfileModel = {
  id: '',
  personal: {
    fullName: '',
    birthDate: '',
    cpf: '',
    phone: '',
    email: '',
  },
  residential: {
    zipCode: '',
    address: '',
    district: '',
    city: '',
    state: '',
  },
  professional: {
    profession: '',
    company: '',
    salary: '',
  },
};

export const ProfileStore = signalStore(
  withDevtools('profile'),
  withState(initialState),
  withComputed((store) => ({
    profileModel: computed(() => ({
      id: store.id(),
      personal: store.personal(),
      residential: store.residential(),
      professional: store.professional(),
    })),
  })),
  withMethods((store) => ({
    updatePersonal(personal: PersonalModel): void {
      patchState(store, { personal });
    },
    updateResidential(residential: ResidentialModel): void {
      patchState(store, { residential });
    },
    updateProfessional(professional: ProfessionalModel): void {
      patchState(store, { professional });
    },
    setId(id: string): void {
      patchState(store, { id });
    },
    loadProfile(profile: ProfileModel): void {
      patchState(store, {
        id: profile.id,
        personal: profile.personal,
        residential: profile.residential,
        professional: profile.professional,
      });
    },
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
