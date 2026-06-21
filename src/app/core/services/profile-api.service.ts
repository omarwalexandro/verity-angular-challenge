import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient, httpResource, HttpContext, HttpResourceRef } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProfileDtoSchema, ProfileModelSchema } from '@shared/models/profile/profile.model';
import type { ProfileModel, CreateProfileDto, ProfileDto } from '@shared/models/profile/profile.model';
import { INCOMING_SCHEMA, OUTGOING_SCHEMA } from '@core/interceptors/validation/validation-context';

@Injectable({
  providedIn: 'root',
})
export class ProfileApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/profiles';

  createProfile(profile: CreateProfileDto): Observable<ProfileDto> {
    const context = new HttpContext()
      .set(OUTGOING_SCHEMA, CreateProfileDtoSchema)
      .set(INCOMING_SCHEMA, ProfileModelSchema);
    return this.http.post<ProfileDto>(this.apiUrl, profile, { context });
  }

  updateProfile(id: string, profile: ProfileModel): Observable<ProfileModel> {
    const context = new HttpContext()
      .set(OUTGOING_SCHEMA, ProfileModelSchema)
      .set(INCOMING_SCHEMA, ProfileModelSchema);
    return this.http.put<ProfileModel>(`${this.apiUrl}/${id}`, profile, { context });
  }

  getProfile(id: Signal<string | null>): HttpResourceRef<ProfileModel | undefined> {
    const context = new HttpContext().set(INCOMING_SCHEMA, ProfileModelSchema);
    return httpResource<ProfileModel>(() => {
      const profileId = id();
      if (!profileId) return undefined;
      return { url: `${this.apiUrl}/${profileId}`, context };
    });
  }
}
