import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, HttpResourceRef } from '@angular/common/http';
import { signal } from '@angular/core';
import { CepService } from './cep.service';
import type { CepModel } from '../../shared/models/cep/cep.model';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CepService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('makes a GET request to ViaCEP with the clean CEP', async () => {
    const mockResponse: CepModel = {
      cep: '60000-000',
      logradouro: 'Rua das Flores',
      complemento: '',
      bairro: 'Centro',
      localidade: 'Fortaleza',
      uf: 'CE',
    };

    const cepSignal = signal('60000-000');
    let resource!: HttpResourceRef<CepModel | undefined>;
    TestBed.runInInjectionContext(() => {
      resource = service.getCep(cepSignal);
    });

    TestBed.flushEffects();

    const req = httpMock.expectOne('https://viacep.com.br/ws/60000000/json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    await Promise.resolve();
    await Promise.resolve();
    TestBed.flushEffects();

    expect(resource.value()?.logradouro).toBe('Rua das Flores');
    expect(resource.value()?.uf).toBe('CE');
  });

  it('strips non-numeric characters from CEP before requesting', () => {
    const cepSignal = signal('60.000-000');
    TestBed.runInInjectionContext(() => {
      service.getCep(cepSignal);
    });

    TestBed.flushEffects();

    const req = httpMock.expectOne('https://viacep.com.br/ws/60000000/json');
    expect(req.request.url).toContain('60000000');
    req.flush({});
  });

  it('makes no request when CEP has fewer than 8 digits', () => {
    const cepSignal = signal('1234-567');
    TestBed.runInInjectionContext(() => {
      service.getCep(cepSignal);
    });

    TestBed.flushEffects();

    httpMock.expectNone('https://viacep.com.br/ws/1234567/json');
  });
});
