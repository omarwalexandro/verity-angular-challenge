import { HttpContextToken } from '@angular/common/http';
import { BaseIssue, BaseSchema } from 'valibot';

/* HttpContextToken to carry the Valibot schema for the incoming response body */
export const INCOMING_SCHEMA = new HttpContextToken<
  BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined
>(() => undefined);

/* HttpContextToken to carry the Valibot schema for the outgoing request body */
export const OUTGOING_SCHEMA = new HttpContextToken<
  BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined
>(() => undefined);
