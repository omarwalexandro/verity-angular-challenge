import { Injectable } from '@angular/core';
import { httpResource, HttpContext, HttpResourceRef } from '@angular/common/http';
import { object, string, array, InferOutput } from 'valibot';
import { INCOMING_SCHEMA } from '@core/interceptors/validation/validation-context';

export const StateSchema = object({ uf: string(), name: string() });
export const StateArraySchema = array(StateSchema);
export type State = InferOutput<typeof StateSchema>;

@Injectable({
  providedIn: 'root',
})
export class StateApiService {
  private readonly apiUrl = 'http://localhost:3000/states';

  getStates(): HttpResourceRef<State[] | undefined> {
    const context = new HttpContext().set(INCOMING_SCHEMA, StateArraySchema);
    return httpResource<State[]>(() => ({ url: this.apiUrl, context }));
  }
}
