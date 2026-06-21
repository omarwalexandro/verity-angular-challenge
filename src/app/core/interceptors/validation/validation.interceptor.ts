import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map, throwError } from 'rxjs';
import { safeParse } from 'valibot';
import { INCOMING_SCHEMA, OUTGOING_SCHEMA } from './validation-context';

export const validationInterceptor: HttpInterceptorFn = (req, next) => {
  const outgoingSchema = req.context.get(OUTGOING_SCHEMA);
  const incomingSchema = req.context.get(INCOMING_SCHEMA);

  /* Validate outgoing request body */
  if (outgoingSchema) {
    const validation = safeParse(outgoingSchema, req.body);
    // console.log('Outgoing Body Validation:', validation);

    if (!validation.success) {
      console.error('Outgoing request validation failed:', validation.issues);

      return throwError(
        () =>
          new HttpErrorResponse({
            error: validation.issues,
            status: 400,
            statusText: 'Requisição Inválida (Validação body)',
            url: req.url,
          }),
      );
    }
  }

  /* Validate incoming response body */
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && incomingSchema) {
        const validation = safeParse(incomingSchema, event.body);
        // console.log('Incoming Body Validation:', validation);

        if (!validation.success) {
          console.error('Incoming response body validation failed:', validation.issues);
          throw new HttpErrorResponse({
            error: validation.issues,
            status: 422,
            statusText: 'Conteúdo não processável (Validação body)',
            url: req.url,
          });
        }
        return event.clone({ body: validation.output });
      }
      return event;
    }),
  );
};
