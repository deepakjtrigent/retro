import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './shared/services/storage.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class UserIdInterceptor implements HttpInterceptor {
  constructor(
    private storageService: StorageService,
    private cookieService: CookieService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let userId: string;

    if (this.storageService.user) {
      userId = this.storageService.user.userId;
    } else {
      const userDetailsCookie = this.cookieService.get('userDetails');
      if (userDetailsCookie) {
        const userDetails = JSON.parse(atob(userDetailsCookie));
        userId = userDetails.userId;
      } else {
        userId = '';

      }
    }

    const modifiedRequest = request.clone({
      setHeaders: {
        'RS-U': userId,
      },
    });
    return next.handle(modifiedRequest);
  }
}
