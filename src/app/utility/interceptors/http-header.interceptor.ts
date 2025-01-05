import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../../api/service/account/authentication/authentication.service';

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {
  constructor(private authSvcs: AuthenticationService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwtToken = this.authSvcs.getJwtToken();
    if (jwtToken) {
      const clone = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + jwtToken),
      });
      return next.handle(clone);
    }
    return next.handle(req);
  }
}