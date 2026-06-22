import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import Review from './review';
import { ProfileStore } from '../profile.store';
import { ProfileService } from '../profile.service';

const FULL_PROFILE = {
  id: 'test-id',
  personal: {
    fullName: 'João Silva',
    birthDate: '01/01/1990',
    cpf: '123.456.789-00',
    phone: '(85) 99999-9999',
    email: 'joao@example.com',
  },
  residential: {
    zipCode: '99999-999',
    address: 'Rua Teste',
    district: 'Bairro Teste',
    city: 'Cidade Teste',
    state: 'SP',
  },
  professional: {
    profession: 'Engenheiro',
    company: 'Tech Corp',
    salary: 'R$ 9.999,99',
  },
};

describe('Review', () => {
  let component: Review;
  let fixture: ComponentFixture<Review>;
  let store: InstanceType<typeof ProfileStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Review],
      providers: [ProfileStore, ProfileService],
    }).compileComponents();

    store = TestBed.inject(ProfileStore);
    store.loadProfile(FULL_PROFILE);

    fixture = TestBed.createComponent(Review);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the full name', () => {
    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('João Silva');
  });

  it('displays the CPF', () => {
    expect(fixture.nativeElement.textContent).toContain('123.456.789-00');
  });

  it('displays the birth date', () => {
    expect(fixture.nativeElement.textContent).toContain('01/01/1990');
  });

  it('displays the phone number', () => {
    expect(fixture.nativeElement.textContent).toContain('(85) 99999-9999');
  });

  it('displays the email', () => {
    expect(fixture.nativeElement.textContent).toContain('joao@example.com');
  });

  it('displays the CEP', () => {
    expect(fixture.nativeElement.textContent).toContain('99999-999');
  });

  it('displays the city', () => {
    expect(fixture.nativeElement.textContent).toContain('Cidade Teste');
  });

  it('displays the profession', () => {
    expect(fixture.nativeElement.textContent).toContain('Engenheiro');
  });

  it('displays the salary', () => {
    expect(fixture.nativeElement.textContent).toContain('R$ 9.999,99');
  });

  it('renders the Exportar PDF button', () => {
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent?.trim()).toContain('Exportar PDF');
  });

  it('calls exportToPdf when the button is clicked', () => {
    const spy = vi.spyOn(component as any, 'exportToPdf');
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  it('profile computed signal returns full profile data', () => {
    const profile = component.profile();
    expect(profile.personal.fullName).toBe('João Silva');
    expect(profile.residential.city).toBe('Cidade Teste');
    expect(profile.professional.salary).toBe('R$ 9.999,99');
  });
});
