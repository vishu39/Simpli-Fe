import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalLinkGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loginLinkToken = localStorage.getItem('loginLinkToken');
    if (!loginLinkToken) {
      let token = window.location.href.split("token=")?.[1]
      this.router.navigate(["/hospital/hospital-login"], {
        queryParams: {
          continue: `hospital/${route.routeConfig.path}`,
          token
        }
      })
      return false
    }
    else {
      return true;
    }
  }

}
