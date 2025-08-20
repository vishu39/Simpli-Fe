import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Injectable({
  providedIn: "root",
})
export class SupremeAuthGuardGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let currentUrl = window.location.href;
    let loginType = GET_LOGIN_TYPE();
    let isSupreme = localStorage.getItem("isSupreme");
    let thisAuthType = "supreme";
    const userToken = localStorage.getItem("userToken");

    let logOut = () => {
      localStorage.clear();
      this.router.navigate([`/user/${loginType || "facilitator"}/auth`]);
    };

    if (currentUrl?.includes(thisAuthType)) {
      if (isSupreme) {
        if (userToken) {
          return true;
        } else {
          logOut();
          return false;
        }
      } else {
        logOut();
        return true;
      }
    } else {
      logOut();
      return false;
    }
  }
}
