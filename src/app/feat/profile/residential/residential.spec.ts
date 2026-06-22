import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import Residential from './residential';
import { ProfileStore } from '../profile.store';
import { ProfileService } from '../profile.service';

describe('Residential', () => {
  let component: Residential;
  let fixture: ComponentFixture<Residential>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Residential],
      providers: [
        ProfileStore,
        ProfileService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Residential);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Flush states request triggered by httpResource effect on first detectChanges
    fixture.detectChanges();
    TestBed.flushEffects();
    httpMock.expectOne('http://localhost:3000/states').flush([]);
    TestBed.flushEffects();
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the residential form', () => {
    expect(fixture.nativeElement.querySelector('form')).toBeTruthy();
  });

  it('renders CEP field with mask placeholder', () => {
    const input = fixture.nativeElement.querySelector('#zipCode') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('00000-000');
  });

  it('renders Endereço field', () => {
    expect(fixture.nativeElement.querySelector('#address')).toBeTruthy();
  });

  it('renders Bairro field', () => {
    expect(fixture.nativeElement.querySelector('#district')).toBeTruthy();
  });

  it('renders Cidade field', () => {
    expect(fixture.nativeElement.querySelector('#city')).toBeTruthy();
  });

  it('renders Estado select', () => {
    expect(fixture.nativeElement.querySelector('#state')).toBeTruthy();
  });

  it('form is initially invalid (required fields empty)', () => {
    expect(component.residentialForm().invalid()).toBe(true);
  });

  it('onBlur saves current model to the store', () => {
    const store = TestBed.inject(ProfileStore);
    component.residentialModel.set({
      zipCode: '99999-999',
      address: 'Rua Teste',
      district: 'Bairro Teste',
      city: 'Cidade Teste',
      state: 'SP',
    });
    (component as any).onBlur();
    expect(store.residential().city).toBe('Cidade Teste');
  });

  it('auto-fills address fields on valid CEP lookup', async () => {
    component.residentialModel.set({
      zipCode: '99999-999',
      address: '',
      district: '',
      city: '',
      state: '',
    });
    (component as any).onCepBlur();

    // Flush the httpResource effect so the CEP HTTP request is scheduled
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://viacep.com.br/ws/99999999/json');
    req.flush({
      cep: '99999-999',
      logradouro: 'Rua Teste',
      complemento: '',
      bairro: 'Bairro Teste',
      localidade: 'Cidade Teste',
      uf: 'SP',
    });

    // Wait for httpResource's internal Promise to resolve, then flush the model-update effect
    await fixture.whenStable();
    TestBed.flushEffects();

    expect(component.residentialModel().address).toBe('Rua Teste');
    expect(component.residentialModel().city).toBe('Cidade Teste');
    expect(component.residentialModel().state).toBe('SP');
  });

  it('does not overwrite user edits when residentialModel changes after CEP autofill', async () => {
    component.residentialModel.set({
      zipCode: '99999-999',
      address: '',
      district: '',
      city: '',
      state: '',
    });
    (component as any).onCepBlur();
    TestBed.flushEffects();

    const req = httpMock.expectOne('https://viacep.com.br/ws/99999999/json');
    req.flush({
      cep: '99999-999',
      logradouro: 'Rua Teste',
      complemento: '',
      bairro: 'Bairro Teste',
      localidade: 'Cidade Teste',
      uf: 'SP',
    });

    await fixture.whenStable();
    TestBed.flushEffects();

    component.residentialModel.update(m => ({ ...m, address: 'Rua Editada pelo Usuário' }));
    TestBed.flushEffects();

    expect(component.residentialModel().address).toBe('Rua Editada pelo Usuário');
  });

  it('does not call CEP API when zipCode length is less than 9', () => {
    component.residentialModel.set({
      zipCode: '999',
      address: '',
      district: '',
      city: '',
      state: '',
    });
    (component as any).onCepBlur();
    TestBed.flushEffects();
    httpMock.expectNone('https://viacep.com.br/ws/999/json');
  });
});

