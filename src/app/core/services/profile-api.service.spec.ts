import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, HttpResourceRef } from '@angular/common/http';
import { signal } from '@angular/core';
import { ProfileApiService } from './profile-api.service';
import type { ProfileModel } from '@shared/models/profile/profile.model';

const mockProfile: ProfileModel = {
  id: 'abc-123',
  personal: {
    fullName: 'João Silva',
    birthDate: '01/01/1990',
    cpf: '123.456.789-00',
    phone: '(85) 99999-9999',
    email: 'joao@example.com',
  },
  residential: {
    zipCode: '60000-000',
    address: 'Rua das Flores',
    district: 'Centro',
    city: 'Fortaleza',
    state: 'CE',
  },
  professional: {
    profession: 'Engenheiro',
    company: 'Tech Corp',
    salary: 'R$ 5.000,00',
  },
};

describe('ProfileApiService', () => {
  let service: ProfileApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProfileApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createProfile', () => {
    it('makes a POST request to the profiles endpoint', () => {
      service.createProfile(mockProfile).subscribe((res) => {
        expect(res.id).toBe('abc-123');
      });

      const req = httpMock.expectOne('http://localhost:3000/profiles');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProfile);
      req.flush(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('makes a PUT request to the correct profile URL', () => {
      service.updateProfile('abc-123', mockProfile).subscribe((res) => {
        expect(res.personal.fullName).toBe('João Silva');
      });

      const req = httpMock.expectOne('http://localhost:3000/profiles/abc-123');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockProfile);
      req.flush(mockProfile);
    });
  });

  describe('getProfile', () => {
    it('makes a GET request to the correct profile URL', async () => {
      const idSignal = signal<string | null>('abc-123');
      let resource!: HttpResourceRef<ProfileModel | undefined>;
      TestBed.runInInjectionContext(() => {
        resource = service.getProfile(idSignal);
      });

      TestBed.flushEffects();

      const req = httpMock.expectOne('http://localhost:3000/profiles/abc-123');
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);

      await Promise.resolve();
      await Promise.resolve();
      TestBed.flushEffects();

      expect(resource.value()?.personal.cpf).toBe('123.456.789-00');
    });

    it('makes no request when id is null', () => {
      const idSignal = signal<string | null>(null);
      TestBed.runInInjectionContext(() => {
        service.getProfile(idSignal);
      });

      TestBed.flushEffects();

      httpMock.expectNone('http://localhost:3000/profiles/null');
    });
  });
});
