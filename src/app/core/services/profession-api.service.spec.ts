import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpResourceRef } from '@angular/common/http';
import { ProfessionApiService, Profession } from './profession-api.service';

describe('ProfessionApiService', () => {
  let service: ProfessionApiService;
  let httpMock: HttpTestingController;

  const mockProfessions: Profession[] = [
    { id: '1', name: 'Engenheiro de Software' },
    { id: '2', name: 'Médico' },
    { id: '3', name: 'Advogado' },
    { id: '4', name: 'Professor' },
    { id: '5', name: 'Contador' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfessionApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProfessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('makes a GET request to the professions endpoint', async () => {
    let resource!: HttpResourceRef<Profession[] | undefined>;
    TestBed.runInInjectionContext(() => {
      resource = service.getProfessions();
    });

    TestBed.flushEffects();

    const req = httpMock.expectOne('http://localhost:3000/professions');
    expect(req.request.method).toBe('GET');
    req.flush(mockProfessions);

    await Promise.resolve();
    await Promise.resolve();
    TestBed.flushEffects();

    expect(resource.value()).toEqual(mockProfessions);
  });

  it('returns an array of Profession objects', async () => {
    let resource!: HttpResourceRef<Profession[] | undefined>;
    TestBed.runInInjectionContext(() => {
      resource = service.getProfessions();
    });

    TestBed.flushEffects();
    httpMock.expectOne('http://localhost:3000/professions').flush(mockProfessions);
    await Promise.resolve();
    await Promise.resolve();
    TestBed.flushEffects();

    expect(resource.value()?.every((p) => 'id' in p && 'name' in p)).toBe(true);
  });

  it('returns at least 5 professions from the mock data', async () => {
    let resource!: HttpResourceRef<Profession[] | undefined>;
    TestBed.runInInjectionContext(() => {
      resource = service.getProfessions();
    });

    TestBed.flushEffects();
    httpMock.expectOne('http://localhost:3000/professions').flush(mockProfessions);
    await Promise.resolve();
    await Promise.resolve();
    TestBed.flushEffects();

    expect((resource.value()?.length ?? 0)).toBeGreaterThanOrEqual(5);
  });
});
