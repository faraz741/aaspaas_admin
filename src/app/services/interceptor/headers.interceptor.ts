import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = localStorage.getItem('token');

    // Check if the request body is FormData
    if (request.body instanceof FormData) {
      // If it's FormData, set the Content-Type header to 'multipart/form-data'
      const modifiedRequest = request.clone({
       
      });
      return next.handle(modifiedRequest);
    } else {
      // For other requests, keep the original Content-Type header
      let modifiedRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        }
      });
         // Ensure the body is a JSON string if it is not already
    if (request.body && typeof request.body !== 'string') {
      modifiedRequest = modifiedRequest.clone({
        body: JSON.stringify(request.body)
      });
    }
      return next.handle(modifiedRequest);
    }
  }
  
}
