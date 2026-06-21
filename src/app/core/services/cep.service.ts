import { Injectable, Signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import type { CepModel } from '../../shared/models/cep/cep.model';

@Injectable({
  providedIn: 'root',
})
export class CepService {
  getCep(cep: Signal<string>): HttpResourceRef<CepModel | undefined> {
    return httpResource<CepModel>(() => {
      const cleanCep = cep().replace(/\D/g, '');
      if (cleanCep.length !== 8) return undefined;
      return `https://viacep.com.br/ws/${cleanCep}/json`;
    });
  }
}
