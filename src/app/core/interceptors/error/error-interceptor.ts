import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, retry, throwError, timer } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const statusTitles: Partial<Record<number, string>> = {
    [HttpStatusCode.BadRequest]: 'Bad Request',
    [HttpStatusCode.Unauthorized]: 'Unauthorized',
    [HttpStatusCode.Forbidden]: 'Forbidden',
    [HttpStatusCode.NotFound]: 'Not Found',
    [HttpStatusCode.Conflict]: 'Conflict',
    [HttpStatusCode.RequestTimeout]: 'Request Timeout',
    [HttpStatusCode.UnsupportedMediaType]: 'Unsupported Media Type',
    [HttpStatusCode.UnprocessableEntity]: 'Validation Error',
    [HttpStatusCode.TooManyRequests]: 'Too Many Requests',
    [HttpStatusCode.InternalServerError]: 'Internal Server Error',
    [HttpStatusCode.BadGateway]: 'Bad Gateway',
    [HttpStatusCode.ServiceUnavailable]: 'Service Unavailable',
    [HttpStatusCode.GatewayTimeout]: 'Gateway Timeout',
  };

  const retriableStatuses = new Set<number>([
    0,
    HttpStatusCode.BadGateway,
    HttpStatusCode.ServiceUnavailable,
    HttpStatusCode.GatewayTimeout,
  ]);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        const shouldRetry =
          req.method.toUpperCase() === 'GET' &&
          retriableStatuses.has(error.status);

        if (!shouldRetry) {
          throw error;
        }

        return timer(retryCount * 500);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      const status = error.status;

      if (status === 0) {
        const message = 'Unable to reach the server. Please check if json-server is running.';
        console.log(message);
        alert(message);
        return throwError(() => error);
      }

      const message =
        error.error?.message ||
        error.error?.error ||
        error.error?.title ||
        'An unknown error occurred.';

      const title = `${status}: ${statusTitles[status] ?? 'Unknown Error'}`;

      const type: 'error' | 'warn' =
        status === HttpStatusCode.BadRequest ||
        status === HttpStatusCode.NotFound ||
        status === HttpStatusCode.Conflict ||
        status === HttpStatusCode.UnsupportedMediaType ||
        status === HttpStatusCode.UnprocessableEntity
          ? 'warn'
          : 'error';

      const duration = status >= 500 ? 5000 : 3000;

      console.log(title, message, duration, type);

      return throwError(() => error);
    }),
  );
};
