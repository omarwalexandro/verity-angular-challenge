import { Injectable } from '@angular/core';
import { httpResource, HttpContext, HttpResourceRef } from '@angular/common/http';
import { object, string, array, InferOutput } from 'valibot';
import { INCOMING_SCHEMA } from '@core/interceptors/validation/validation-context';

export const ProfessionSchema = object({ id: string(), name: string() });
export const ProfessionArraySchema = array(ProfessionSchema);
export type Profession = InferOutput<typeof ProfessionSchema>;

@Injectable({
  providedIn: 'root',
})
export class ProfessionApiService {
  private readonly apiUrl = 'http://localhost:3000/professions';

  getProfessions(): HttpResourceRef<Profession[] | undefined> {
    const context = new HttpContext().set(INCOMING_SCHEMA, ProfessionArraySchema);
    return httpResource<Profession[]>(() => ({ url: this.apiUrl, context }));
  }
}
