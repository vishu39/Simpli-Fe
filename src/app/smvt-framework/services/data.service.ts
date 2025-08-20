import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment'
import { SharedService } from 'src/app/core/service/shared/shared.service';


@Injectable({
    providedIn: 'root'
})
export class DataService {
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json; charset=utf-8',
        }),
        responseType: 'text' as 'json'
    };
    constructor(private http: HttpClient,private sharedService: SharedService) { }

    handleError(error: any): any {
        return // console.log(error);

    }

    get(route: string): Observable<any> {
        return this.http.get(environment.cmsApiUrl + route)
            .pipe(
                // map((res: any) => {res.data = this.sharedService.decrypt(res.data)  Temporary Committed for CMS apis
                //     return res;
                // }), 
                retry(1),
                catchError(this.handleError.bind(this))
            )
    }

    put(route: string, data: any): Observable<any> {
        data = this.sharedService.encrypt(data)
        return this.http.put(environment.facilitatorAdminServiceApiUrl + '/' + route, data)
            .pipe(
                retry(1),
                catchError(this.handleError.bind(this))
            )
    }

    update(route: string, data: any): Observable<any> {
        return this.put(route, data)
    }

    post(route: string, data: any): Observable<any> {
        return this.http.post(environment.facilitatorAdminServiceApiUrl + '/' + route, data)
            .pipe(
                retry(1),
                catchError(this.handleError.bind(this))
            )
    }
    encryptPost(route: string, data: any): Observable<any> {
        data = this.sharedService.encrypt(data)
        return this.http.post(environment.facilitatorAdminServiceApiUrl + '/' + route, data)
            .pipe(
                retry(1),
                catchError(this.handleError.bind(this))
            )
    }

    create(route: string, data: any): Observable<any> {
        return this.post(route, data)
    }

    delete(route: string): Observable<any> {
        return this.http.delete(environment.facilitatorAdminServiceApiUrl + '/' + route)
            .pipe(
                retry(1),
                catchError(this.handleError.bind(this)),
            )
    }
}