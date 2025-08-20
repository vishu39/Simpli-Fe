import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NavigationExtras, Router } from "@angular/router";
import jwt_decode from "jwt-decode";
import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { InterceptorSkipHeader } from "../../interceptor/custom.interceptor";
import { BehaviorSubject, map, Subject } from "rxjs";
import { NgxUiLoaderService } from "ngx-ui-loader";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private http: HttpClient,
    private ngxService: NgxUiLoaderService
  ) {}
  readonly cmsApiUrl = environment.cmsApiUrl;
  readonly sharedServiceApiUrl = environment.sharedServiceApiUrl;

  secretKeyCrypto = environment.secretKeyCrypto;

  realTimeNotificationSubject = new Subject();
  unreadCommentSubject = new Subject();
  callApiForCompletedAndFinance = new Subject();
  queryDetailSubject = new BehaviorSubject({});
  facilitatorLoginSubject = new Subject();
  hospitalLoginSubject = new Subject();
  hospitalEmailZoneSubject = new Subject();
  doctorEmailZoneSubject = new Subject();
  hospitalEmailZoneSettingSubject = new Subject();
  staffEmployeeSubject = new Subject();
  staffDoctorSubject = new Subject();
  themeSubject = new Subject();
  mailUnreadCountSubject = new Subject();
  // subject for email communication
  emailCommunicationChangedSubjectForHospital = new BehaviorSubject({
    isChanged: false,
  });

  emailCommunicationChangedSubjectForFacilitator = new BehaviorSubject({
    isChanged: false,
  });

  decrypt(encryptedCipherText: string) {
    var bytes = CryptoJS.AES.decrypt(encryptedCipherText, this.secretKeyCrypto);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8) || null);
  }
  encrypt(data: any) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKeyCrypto
    ).toString();
  }

  showNotification(colorName: string, text: string) {
    this._snackBar.open(text, "", {
      duration: 5000,
      panelClass: colorName,
    });
  }
  showNotificationAction(
    colorName: string,
    text: string,
    interceptedRoute: string
  ) {
    let snackBarRef = this._snackBar.open(text, "Dismiss", {
      panelClass: colorName,
    });
    snackBarRef.afterDismissed().subscribe(() => {
      if (!!interceptedRoute) {
        let routeArray =
          JSON.parse(localStorage.getItem("dismissRoutes")) || [];
        routeArray.push(interceptedRoute.split("?")?.[0]);
        localStorage.setItem("dismissRoutes", JSON.stringify(routeArray));
      }
    });
  }
  startLoader() {
    this.ngxService.start();
  }
  stopLoader() {
    this.ngxService.stop();
  }

  logout() {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: false,
    };

    let loginType = localStorage.getItem("loginType");
    localStorage.clear();
    this.router
      .navigate([`/user/${loginType || "hospital"}/auth`], navigationExtras)
      .then(() => {
        window.location.reload();
      });
    this.showNotification("snackBar-success", "Logout successful");
  }
  decodeToken() {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const decoded = jwt_decode(userToken);
      return decoded;
    }
  }

  hospitalLogin(paylaod: any) {
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", null);
    const dataEncrypt = this.encrypt(paylaod);
    let data = {
      dataEncrypt,
      loginLink: true,
    };
    return this.http.post(this.sharedServiceApiUrl + `hospitalLinkLogin`, data);
  }

  getCmsData(slug, data: any) {
    const cmsToken = localStorage.getItem("cmsToken");
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${cmsToken}`);
    return this.http.get(
      this.cmsApiUrl +
        `admin/${slug}?page=${data.page}&limit=${data.limit}&search=${data.search}`,
      { headers }
    );
  }

  getAllHospital(data) {
    const params = new HttpParams()
      .set("limit", data.limit)
      .set("page", data.page)
      .set("search", data.search)
      .set("filterObj", JSON.stringify(data?.filterObj || []));
    return this.http
      .get(this.sharedServiceApiUrl + `getAllHospital`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }
  getAllDoctor(data) {
    const params = new HttpParams()
      .set("limit", data.limit)
      .set("page", data.page)
      .set("search", data.search)
      .set("filterObj", JSON.stringify(data?.filterObj || []));

    return this.http
      .get(this.sharedServiceApiUrl + `getAllDoctor`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }
  getAllAggregator() {
    return this.http.get(this.sharedServiceApiUrl + `getAllAggregator`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getS3Object(data: any) {
    const dataEncrypt = this.encrypt(data);
    return this.http
      .post(this.sharedServiceApiUrl + "getS3Object", { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getQueryManagementEvent() {
    return this.http
      .get(this.sharedServiceApiUrl + "getQueryManagementEvent")
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  // get Facilitator Admin UserType

  getFacilitatorAdminUserType() {
    return this.http
      .get(this.sharedServiceApiUrl + `getFacilitatorAdminUserType`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  // get Hospital Admin UserType

  getHospitalAdminUserType() {
    return this.http
      .get(this.sharedServiceApiUrl + `getHospitalAdminUserType`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  // Download doctor profile
  generateDoctorProfile(data: any) {
    const dataEncrypt = this.encrypt(data);
    return this.http.post(this.sharedServiceApiUrl + "generateDoctorProfile", {
      dataEncrypt,
    });
  }

  // Plans
  getCustomerPlan() {
    return this.http.get(this.sharedServiceApiUrl + `getCustomerPlan`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getPlan(id: string) {
    return this.http.get(this.sharedServiceApiUrl + `getPlan/${id}`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }
  getCustomerUserFeatureLicence() {
    return this.http
      .get(this.sharedServiceApiUrl + `getCustomerUserFeatureLicence`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getCustomerFeature() {
    return this.http.get(this.sharedServiceApiUrl + `getCustomerFeature`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }
  getCustomerReferralFeatureLicence() {
    return this.http
      .get(this.sharedServiceApiUrl + `getCustomerReferralFeatureLicence`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getAllUserByQueryViewSetting(id: string) {
    return this.http
      .get(this.sharedServiceApiUrl + `getAllUserByQueryViewSetting/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }
  getNotificationEvent() {
    return this.http
      .get(`${this.sharedServiceApiUrl}getNotificationEvent`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  addDoctor(data: any) {
    const cmsToken = localStorage.getItem("cmsToken");
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${cmsToken}`);
    return this.http.post(this.cmsApiUrl + `admin/addDoctor`, data, {
      headers,
    });
  }

  editDoctor(id: any, data: any) {
    const cmsToken = localStorage.getItem("cmsToken");
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${cmsToken}`);
    return this.http.put(this.cmsApiUrl + `admin/editDoctor/${id}`, data, {
      headers,
    });
  }

  addHospital(data: any) {
    const cmsToken = localStorage.getItem("cmsToken");
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${cmsToken}`);
    return this.http.post(this.cmsApiUrl + `admin/addHospital`, data, {
      headers,
    });
  }

  editHospital(id: any, data: any) {
    const cmsToken = localStorage.getItem("cmsToken");
    const headers = new HttpHeaders()
      .set(InterceptorSkipHeader, "")
      .set("Authorization", `Bearer ${cmsToken}`);
    return this.http.put(this.cmsApiUrl + `admin/editHospital/${id}`, data, {
      headers,
    });
  }

  getAllFacilitator(data) {
    return this.http
      .get(this.sharedServiceApiUrl + `getAllFacilitator`, { params: data })
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getAdminDetails() {
    return this.http.get(this.sharedServiceApiUrl + `getAdminDetails`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getBankAccountType() {
    return this.http.get(this.sharedServiceApiUrl + `getBankAccountType`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getOpinionFormatType() {
    return this.http
      .get(this.sharedServiceApiUrl + `getOpinionFormatType`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getVilFormatType() {
    return this.http.get(this.sharedServiceApiUrl + `getVilFormatType`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getPreReferralPartner(id: string) {
    return this.http
      .get(this.sharedServiceApiUrl + `getPreReferralPartner/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getOwnReferralPartner(id: string) {
    return this.http
      .get(this.sharedServiceApiUrl + `getOwnReferralPartner/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getDoctorFormatType() {
    return this.http.get(this.sharedServiceApiUrl + `getDoctorFormatType`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getCustomerSubscription() {
    return this.http
      .get(this.sharedServiceApiUrl + `getCustomerSubscription`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientExcelReportType() {
    return this.http
      .get(this.sharedServiceApiUrl + `getPatientExcelReportType`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getForwardToDocSource() {
    return this.http
      .get(this.sharedServiceApiUrl + `getForwardToDocSource`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getEmailSettingType() {
    return this.http.get(this.sharedServiceApiUrl + `getEmailSettingType`).pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getAcknowledgementQueryManagementEvent() {
    return this.http
      .get(this.sharedServiceApiUrl + "getAcknowledgementQueryManagementEvent")
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  acknowledgementPopupByEvent(data: any) {
    const dataEncrypt = this.encrypt(data);
    return this.http
      .post(this.sharedServiceApiUrl + "acknowledgementPopupByEvent", {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getFollowUpQueryManagementEvent() {
    return this.http
      .get(this.sharedServiceApiUrl + "getFollowUpQueryManagementEvent")
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  followUpPopup(data: any) {
    const dataEncrypt = this.encrypt(data);
    return this.http
      .post(this.sharedServiceApiUrl + "followUpPopup", {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getFollowUpMention() {
    return this.http.get(this.sharedServiceApiUrl + "getFollowUpMention").pipe(
      map((res: any) => {
        res.data = this.decrypt(res.data);
        return res;
      })
    );
  }

  getFollowUpReportType() {
    return this.http
      .get(this.sharedServiceApiUrl + "getFollowUpReportType")
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getRemoteFileStreams(data: any) {
    const dataEncrypt = this.encrypt(data);
    return this.http
      .post(this.sharedServiceApiUrl + "getRemoteFileStreams", { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  getTreatmentFromReport(id: any) {
    return this.http
      .get(this.sharedServiceApiUrl + `getTreatmentFromReport/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  readPassportFromImage(payload: any) {
    return this.http
      .post(`${this.sharedServiceApiUrl}readPassportFromImage`, payload)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }

  readPassportFromFile(payload: any) {
    return this.http
      .post(`${this.sharedServiceApiUrl}readPassportFromFile`, payload)
      .pipe(
        map((res: any) => {
          res.data = this.decrypt(res.data);
          return res;
        })
      );
  }
}
