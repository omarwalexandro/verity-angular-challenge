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
      cep: '99999-999',
      logradouro: 'Rua Teste',
      complemento: '',
      bairro: 'Bairro Teste',
      localidade: 'Cidade Teste',
      uf: 'SP',
    };

    const cepSignal = signal('99999-999');
    let resource!: HttpResourceRef<CepModel | undefined>;
    TestBed.runInInjectionContext(() => {
      resource = service.getCep(cepSignal);
    });

    TestBed.flushEffects();

    const req = httpMock.expectOne('https://viacep.com.br/ws/99999999/json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    await Promise.resolve();
    await Promise.resolve();
    TestBed.flushEffects();

    expect(resource.value()?.logradouro).toBe('Rua Teste');
    expect(resource.value()?.uf).toBe('SP');
  });

  it('strips non-numeric characters from CEP before requesting', () => {
    const cepSignal = signal('99.999-999');
    TestBed.runInInjectionContext(() => {
      service.getCep(cepSignal);
    });

    TestBed.flushEffects();

    const req = httpMock.expectOne('https://viacep.com.br/ws/99999999/json');
    expect(req.request.url).toContain('99999999');
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
