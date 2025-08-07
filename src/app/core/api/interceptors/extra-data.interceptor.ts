import { HttpErrorResponse, HttpEvent, HttpHandlerFn,HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, throwError } from 'rxjs';

export const requestHeadersInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const messageService = inject(MessageService);

  req = req.clone({
    setHeaders: {
      // 'ngrok-skip-browser-warning': 'true'
    }
  });

  // Handle response and errors
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = error.error.message;

      if (error.status === 404) {
        errorMessage = 'Ресурс не найден';
      } else if (error.status === 400) {
        errorMessage = 'Некорректные данные';
      } else {
        console.error(error);
        errorMessage = 'Произошла ошибка';
      }

      messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: errorMessage,
        life: 3000
      });
      return throwError(() => error);
    })
  );
};
