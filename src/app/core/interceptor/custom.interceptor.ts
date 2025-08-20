import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, retry, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SharedService } from "../service/shared/shared.service";
import { environment } from "src/environments/environment";
import { getDeviceIdFromLocalStorage } from "src/app/shared/constant";

export const InterceptorSkipHeader = "X-Skip-Interceptor";

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialog,
    private sharedService: SharedService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.has(InterceptorSkipHeader)) {
      const headers = req.headers.delete(InterceptorSkipHeader);
      return next.handle(req.clone({ headers }));
    }
    let authorization: string;
    if (req.url.startsWith(environment.cmsApiUrl)) {
      authorization = localStorage.getItem("cmsToken");
    } else {
      authorization = localStorage.getItem("userToken");
    }

    let deviceId = getDeviceIdFromLocalStorage();

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authorization}`,
        "Access-Control-Allow-Origin": "*",
        deviceId: deviceId,
      },
    });
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 0) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "Please check your internet connectivity"
          );
        } else if (err.status == 401) {
          const userType = localStorage.getItem("userType");
          localStorage.clear();
          localStorage.setItem("userType", userType);
          let loginType = localStorage.getItem("loginType");
          if (loginType === "facilitator") {
            this.router.navigate(["/user/facilitator/auth"]);
          } else if (loginType === "hospital") {
            this.router.navigate(["/user/hospital/auth"]);
          }
          this.dialogRef.closeAll();
          this.sharedService.showNotification(
            "snackBar-danger",
            err.error.message
          );
        } else if (err.status === 403) {
          let dismissRoutes =
            JSON.parse(localStorage.getItem("dismissRoutes")) || [];
          if (
            !dismissRoutes.includes(req?.url?.split("?")?.[0]) &&
            req.method === "GET"
          ) {
            this.sharedService.showNotificationAction(
              "snackBar-danger",
              err.error.message,
              req?.url
            );
          } else if (req.method !== "GET") {
            this.sharedService.showNotificationAction(
              "snackBar-danger",
              err.error.message,
              undefined
            );
          }
        } else if (err.status === 500) {
          this.sharedService.showNotification(
            "snackBar-danger",
            "Under maintenance - Try in 5 min"
          );
        } else {
          this.sharedService.showNotification(
            "snackBar-danger",
            err.error.message
          );
        }
        return throwError(err);
      })
    );
  }
}
