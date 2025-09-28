import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared/shared.service';
export const InterceptorSkipLoaderHeader = 'X-Skip-Loader-Interceptor';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private ngxService: NgxUiLoaderService, private router: Router, private sharedService: SharedService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      if (!req.headers.has(InterceptorSkipLoaderHeader)) {
        this.sharedService.startLoader();
      }
    }
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (req.method !== 'GET') {
            // if (!req.headers.has(InterceptorSkipLoaderHeader)) {
              this.sharedService.stopLoader();
            // }
          }
        }
      }),
      finalize(() => {
        if (req.method !== 'GET') {
          // if (!req.headers.has(InterceptorSkipLoaderHeader)) {
            this.sharedService.stopLoader();
          // }
        }
      })
    )
  }
}