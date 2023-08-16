import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './shared/services/storage.service';

@Injectable()
export class UserIdInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userId = this.storageService.user.userId;

    const modifiedRequest = request.clone({
      setHeaders: {
        'SP-U': userId,
      },
    });

    return next.handle(modifiedRequest);
  }
}
