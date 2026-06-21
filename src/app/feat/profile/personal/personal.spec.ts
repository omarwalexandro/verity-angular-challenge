import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import Personal from './personal';
import { ProfileStore } from '../profile.store';
import { ProfileService } from '../profile.service';

describe('Personal', () => {
  let component: Personal;
  let fixture: ComponentFixture<Personal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personal],
      providers: [
        ProfileStore,
        ProfileService,
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Personal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the personal data form', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('form')).toBeTruthy();
  });

  it('renders Nome Completo field', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#fullName')).toBeTruthy();
  });

  it('renders Data de Nascimento field with date mask placeholder', () => {
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('#birthDate') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('dd/mm/aaaa');
  });

  it('renders CPF field with correct placeholder', () => {
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('#cpf') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('000.000.000-00');
  });

  it('renders Telefone field', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#phone')).toBeTruthy();
  });

  it('renders E-mail field', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#email')).toBeTruthy();
  });

  it('form is initially invalid (required fields empty)', () => {
    expect(component.personalForm().invalid()).toBe(true);
  });

  it('onBlur saves current model to the store', () => {
    const store = TestBed.inject(ProfileStore);
    component.personalModel.set({
      fullName: 'Maria Souza',
      birthDate: '10/05/1985',
      cpf: '987.654.321-00',
      phone: '(11) 91234-5678',
      email: 'maria@example.com',
    });
    (component as any).onBlur();
    expect(store.personal().fullName).toBe('Maria Souza');
  });
});

