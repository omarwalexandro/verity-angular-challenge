import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import Professional from './professional';
import { ProfileStore } from '../profile.store';
import { ProfileService } from '../profile.service';
import type { Profession } from '@core/services/profession-api.service';

const MOCK_PROFESSIONS: Profession[] = [
  { id: '1', name: 'Engenheiro de Software' },
  { id: '2', name: 'Médico' },
  { id: '3', name: 'Advogado' },
  { id: '4', name: 'Professor' },
  { id: '5', name: 'Contador' },
];

describe('Professional', () => {
  let component: Professional;
  let fixture: ComponentFixture<Professional>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Professional],
      providers: [
        ProfileStore,
        ProfileService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Professional);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    TestBed.flushEffects();
    httpMock.expectOne('http://localhost:3000/professions').flush(MOCK_PROFESSIONS);
    TestBed.flushEffects();
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the professional form', () => {
    expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
  });

  it('renders the Profissão select field', () => {
    expect(fixture.nativeElement.querySelector('#profession')).toBeTruthy();
  });

  it('renders the Empresa field', () => {
    expect(fixture.nativeElement.querySelector('#company')).toBeTruthy();
  });

  it('renders the Salário field', () => {
    expect(fixture.nativeElement.querySelector('#salary')).toBeTruthy();
  });

  it('form is initially invalid (required fields empty)', () => {
    expect(component.professionalForm().invalid()).toBe(true);
  });

  it('loads professions from the API and renders options', () => {
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('#profession') as HTMLSelectElement;
    // options = 1 disabled placeholder + 5 professions
    expect(select.options.length).toBeGreaterThanOrEqual(5);
  });

  it('professions signal contains at least 5 items after API response', () => {
    expect((component as any).professions().length).toBeGreaterThanOrEqual(5);
  });

  it('onBlur saves current model to the store', () => {
    const store = TestBed.inject(ProfileStore);
    component.professionalModel.set({
      profession: 'Engenheiro de Software',
      company: 'Tech Corp',
      salary: 'R$ 10.000,00',
    });
    (component as any).onBlur();
    expect(store.professional().profession).toBe('Engenheiro de Software');
    expect(store.professional().salary).toBe('R$ 10.000,00');
  });
});

