// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, finalize, filter, take } from 'rxjs/operators';
import { ICurrentUser } from './interfaces/user';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) { }

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    if (request.url.match(/api\//)) { 
        return next.handle(this.addTokenToRequest(request, this.authService.getToken()))
          .pipe(
            catchError(err => {
              if (err instanceof HttpErrorResponse) {
                switch ((<HttpErrorResponse>err).status) {
                  case 401:
                    return this.handle401Error(request, next);
                  case 400:
                    return <any>this.authService.logoutUser();
                }
              } else {
                return throwError(err);
              }
            }));
      }
      else 
      {
        return next.handle(request); // call original auth request.
      }
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authService.refreshToken()
        .pipe(
          switchMap((user: ICurrentUser) => {
            if (user) {
              this.tokenSubject.next(user.AccessToken);
              //localStorage.setItem('currentUser', JSON.stringify(user));
              return next.handle(this.addTokenToRequest(request, user.AccessToken));
            }

            return <any>this.authService.logoutUser();
          }),
          catchError(err => {
            return <any>this.authService.logoutUser();
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;

      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addTokenToRequest(request, token));
          }));
    }
  }
}
// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//     constructor(public authService: AuthenticationService) { }
//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         var token = this.authService.getToken();
//         if (token != null) {
//             request = request.clone({
//                 setHeaders: {
//                     Authorization: `Bearer ${token}`,
//                     // 'Access-Control-Allow-Origin': "http://localhost:4200",
//                 }
//             });
//         }
//         return next.handle(request);
//     }
// }