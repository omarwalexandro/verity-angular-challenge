import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ProfileStore } from './profile.store';
import type { PersonalModel, ResidentialModel, ProfessionalModel } from '@shared/models/profile/profile.model';

const mockPersonal: PersonalModel = {
  fullName: 'João Silva',
  birthDate: '01/01/1990',
  cpf: '123.456.789-00',
  phone: '(85) 99999-9999',
  email: 'joao@example.com',
};

const mockResidential: ResidentialModel = {
  zipCode: '99999-999',
  address: 'Rua Teste',
  district: 'Bairro Teste',
  city: 'Cidade Teste',
  state: 'SP',
};

const mockProfessional: ProfessionalModel = {
  profession: 'Engenheiro',
  company: 'Tech Corp',
  salary: 'R$ 9.999,99',
};

describe('ProfileStore', () => {
  let store: InstanceType<typeof ProfileStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ProfileStore] });
    store = TestBed.inject(ProfileStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have empty initial state', () => {
    expect(store.personal().fullName).toBe('');
    expect(store.residential().zipCode).toBe('');
    expect(store.professional().profession).toBe('');
    expect(store.id()).toBe('');
  });

  describe('updatePersonal', () => {
    it('updates personal data in the store', () => {
      store.updatePersonal(mockPersonal);
      expect(store.personal().fullName).toBe('João Silva');
      expect(store.personal().email).toBe('joao@example.com');
    });
  });

  describe('updateResidential', () => {
    it('updates residential data in the store', () => {
      store.updateResidential(mockResidential);
      expect(store.residential().zipCode).toBe('99999-999');
      expect(store.residential().city).toBe('Cidade Teste');
    });
  });

  describe('updateProfessional', () => {
    it('updates professional data in the store', () => {
      store.updateProfessional(mockProfessional);
      expect(store.professional().profession).toBe('Engenheiro');
      expect(store.professional().salary).toBe('R$ 9.999,99');
    });
  });

  describe('setId', () => {
    it('sets the profile id', () => {
      store.setId('abc-123');
      expect(store.id()).toBe('abc-123');
    });
  });

  describe('loadProfile', () => {
    it('loads a full profile into the store', () => {
      store.loadProfile({
        id: 'xyz',
        personal: mockPersonal,
        residential: mockResidential,
        professional: mockProfessional,
      });
      expect(store.id()).toBe('xyz');
      expect(store.personal().fullName).toBe('João Silva');
      expect(store.residential().city).toBe('Cidade Teste');
      expect(store.professional().company).toBe('Tech Corp');
    });
  });

  describe('profileModel computed', () => {
    it('returns a combined model from all sections', () => {
      store.updatePersonal(mockPersonal);
      store.updateResidential(mockResidential);
      store.updateProfessional(mockProfessional);
      store.setId('test-id');

      const model = store.profileModel();
      expect(model.id).toBe('test-id');
      expect(model.personal.fullName).toBe('João Silva');
      expect(model.residential.city).toBe('Cidade Teste');
      expect(model.professional.salary).toBe('R$ 9.999,99');
    });
  });

  describe('reset', () => {
    it('resets all state to initial empty values', () => {
      store.updatePersonal(mockPersonal);
      store.setId('some-id');
      store.reset();
      expect(store.personal().fullName).toBe('');
      expect(store.id()).toBe('');
    });
  });
});
