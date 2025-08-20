import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, takeUntil } from "rxjs";
import { GlobalCancelService } from "../service/global-cancel.service";

@Injectable()
export class DestroyApiCall implements HttpInterceptor {
  constructor(private globalCancelService: GlobalCancelService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Use takeUntil with the global cancel subject
    return next
      .handle(req)
      .pipe(takeUntil(this.globalCancelService.getCancelSignal()));
  }
}
