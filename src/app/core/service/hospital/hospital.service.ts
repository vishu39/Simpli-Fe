import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SharedService } from "../shared/shared.service";
import { InterceptorSkipLoaderHeader } from "../../interceptor/loader.interceptor";
import { getUserType } from "src/app/shared/routing-constant";
@Injectable({
  providedIn: "root",
})
export class HospitalService {
  serviceApiUrl: string =
    // localStorage.getItem("userType") === "admin"
    getUserType() === "admin"
      ? environment.hospitalAdminServiceApiUrl
      : environment.hospitalInternalUserServiceApiUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
    private sharedService: SharedService
  ) {
    this.sharedService.hospitalLoginSubject.subscribe((res) => {
      if (res === "admin") {
        this.serviceApiUrl = environment.hospitalAdminServiceApiUrl;
      } else if (res === "member") {
        this.serviceApiUrl = environment.hospitalInternalUserServiceApiUrl;
      }
    });
  }

  login(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "login", { dataEncrypt }).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  verifyOtp(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "verifyOtp", { dataEncrypt });
  }
  // Account Details

  addAccountDetails(data: any) {
    return this.http.post(this.serviceApiUrl + "addAccountDetails", data);
  }
  editAccountDetails(data: any) {
    return this.http.put(this.serviceApiUrl + "editAccountDetails", data);
  }
  getAccountDetails() {
    return this.http.get(this.serviceApiUrl + "getAccountDetails").pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAccountDetailsAttribute() {
    return this.http
      .get(this.serviceApiUrl + "getAccountDetailsAttribute")
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Internal User

  addInternalUser(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addInternalUser", {
      dataEncrypt,
    });
  }

  editInternalUser(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editInternalUser/${id}`, {
      dataEncrypt,
    });
  }
  getAllInternalUser(data: any) {
    return this.http
      .get(
        this.serviceApiUrl +
          `getAllInternalUser?page=${data.page}&limit=${data.limit}&search=${
            data.search
          }&filterObj=${JSON.stringify(data?.filterObj || [])}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllReferralPartner() {
    const params = new HttpParams().set("isReferral", true);
    return this.http
      .get(this.serviceApiUrl + `getInternalUserByUserType`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllEmployeeUser() {
    const params = new HttpParams().set("isReferral", false);
    return this.http
      .get(this.serviceApiUrl + `getInternalUserByUserType`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllEmployeeUserHopsital(params: any) {
    // const params = new HttpParams().set("isQueryViewSetting", true);
    return this.http
      .get(this.serviceApiUrl + `getInternalUserByUserType`, {
        params: { ...params },
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  deleteInternalUser(id: any) {
    return this.http.delete(this.serviceApiUrl + `deleteInternaluser/${id}`);
  }

  // Email Content

  getAllEmailContent() {
    return this.http.get(this.serviceApiUrl + `getAllEmailContent`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllDefaultEmailContent() {
    return this.http.get(this.serviceApiUrl + `getAllDefaultEmailContent`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getEmailContent(id: any) {
    return this.http.get(this.serviceApiUrl + `getEmailContent/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  deleteEmailContent(id: any) {
    return this.http.delete(this.serviceApiUrl + `deleteEmailContent/${id}`);
  }

  addEmailContent(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);

    return this.http.post(this.serviceApiUrl + `addEmailContent`, {
      dataEncrypt,
    });
  }

  editEmailContent(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editEmailContent/${id}`, {
      dataEncrypt,
    });
  }

  getEmailContentModule() {
    return this.http.get(this.serviceApiUrl + `getEmailContentModule`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // Hospital Staff

  addHospitalStaff(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addHospitalStaff`, {
      dataEncrypt,
    });
  }

  editHospitalStaff(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editHospitalStaff/${id}`, {
      dataEncrypt,
    });
  }

  getAllHospitalStaff(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getAllHospitalStaff`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getHospitalStaff(id: any) {
    return this.http.get(this.serviceApiUrl + `getHospitalStaff/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getStaffByType(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("type", data.type)
      .set("hospital", data.hospital)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getStaffByType`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getDefaultStaffByType(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("type", data.type)
      .set("hospital", data.hospital)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getDefaultStaffByType`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getStaffByHospital(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("hospital", data.hospital)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getStaffByHospital`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteHospitalStaff(id: any) {
    return this.http.delete(this.serviceApiUrl + `deleteHospitalStaff/${id}`);
  }

  // Dashboard

  getQueryCount(data: any) {
    const params = new HttpParams()
      .set("condition", data.condition)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate);
    return this.http.get(`${this.serviceApiUrl}getQueryCount`, { params }).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getVilCount(data: any) {
    const params = new HttpParams()
      .set("condition", data.condition)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate);
    return this.http.get(`${this.serviceApiUrl}getVilCount`, { params }).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getConfirmationCount(data: any) {
    const params = new HttpParams()
      .set("condition", data.condition)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate);
    return this.http
      .get(`${this.serviceApiUrl}getPatientConfirmationCount`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAvgOpinionTime() {
    return this.http.get(`${this.serviceApiUrl}getAvgOpinionTime`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getLast6MonthQueryCount() {
    return this.http.get(`${this.serviceApiUrl}getLast6MonthQueryCount`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getLast6MonthVilCount() {
    return this.http.get(`${this.serviceApiUrl}getLast6MonthVilCount`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getLast6MonthPatientConfirmationCount() {
    return this.http
      .get(`${this.serviceApiUrl}getLast6MonthPatientConfirmationCount`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getJourneyFromOpinion() {
    return this.http.get(`${this.serviceApiUrl}getJourneyFromOpinion`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getJourneyFromVil() {
    return this.http.get(`${this.serviceApiUrl}getJourneyFromVil`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getQueryByCountry(data: any) {
    const params = new HttpParams()
      .set("condition", data.condition)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate);
    return this.http
      .get(`${this.serviceApiUrl}getQueryByCountry`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getQueryByDepartment(data: any) {
    const params = new HttpParams()
      .set("condition", data.condition)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate);
    return this.http
      .get(`${this.serviceApiUrl}getQueryByDepartment`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getQueryByPartner(data: any) {
    const params = new HttpParams()
      .set("condition", data.condition)
      .set("startDate", data.startDate)
      .set("endDate", data.endDate);
    return this.http
      .get(`${this.serviceApiUrl}getQueryByPartner`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientConfirmationCalendar(data: any) {
    const params = new HttpParams()
      .set("condition", "dateRange")
      .set("startDate", data.startDate)
      .set("endDate", data.endDate);
    return this.http
      .get(`${this.serviceApiUrl}getPatientConfirmationCalendar`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Template Setting

  addTemplateSetting(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addTemplateSetting", {
      dataEncrypt,
    });
  }

  editTemplateSetting(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editTemplateSetting/${id}`, {
      dataEncrypt,
    });
  }

  getTemplateSetting() {
    return this.http.get(this.serviceApiUrl + `getTemplateSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // Auto reminder Setting

  addAutoReminderSetting(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addAutoReminderSetting", {
      dataEncrypt,
    });
  }

  editAutoReminderSetting(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editAutoReminderSetting/${id}`, {
      dataEncrypt,
    });
  }

  getAutoReminderSetting() {
    return this.http.get(this.serviceApiUrl + `getAutoReminderSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // User Profile

  editProfile(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + "editProfile", { dataEncrypt });
  }

  getProfile() {
    return this.http.get(this.serviceApiUrl + `getProfile`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // Change Password

  changePassword(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + "changePassword", {
      dataEncrypt,
    });
  }

  // Email setting

  // addEmailSetting(data: any) {
  //   const dataEncrypt = this.sharedService.encrypt(data);
  //   return this.http.post(this.serviceApiUrl + "addEmailSetting", {
  //     dataEncrypt,
  //   });
  // }

  // editEmailSetting(id: any, data: any) {
  //   const dataEncrypt = this.sharedService.encrypt(data);
  //   return this.http.put(this.serviceApiUrl + `editEmailSetting/${id}`, {
  //     dataEncrypt,
  //   });
  // }

  // getEmailSetting() {
  //   return this.http.get(this.serviceApiUrl + `getEmailSetting`).pipe(
  //     map((res: any) => {
  //       res.data = this.sharedService.decrypt(res.data);
  //       return res;
  //     })
  //   );
  // }

  // Reports

  downloadPatientExcelReport(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "downloadPatientExcelReport", {
      dataEncrypt,
    });
  }

  getAllPatientExcelReport(data: any) {
    const params = new HttpParams()
      .set("limit", data.limit)
      .set("page", data.page)
      .set("search", data.search);
    return this.http
      .get(`${this.serviceApiUrl}getAllPatientExcelReport`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // patient
  addPatient(data: any) {
    return this.http.post(this.serviceApiUrl + "addPatient", data).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  editPatient(patientId: string, data: any) {
    return this.http.put(this.serviceApiUrl + `editPatient/${patientId}`, data);
  }
  checkDuplicatePatient(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    const headers = new HttpHeaders().set(InterceptorSkipLoaderHeader, "");

    return this.http.post(
      this.serviceApiUrl + "checkDuplicatePatient",
      { dataEncrypt },
      { headers }
    );
  }
  getAllPatient(data: any) {
    const params = new HttpParams()
      .set("limit", data.limit)
      .set("page", data.page)
      .set("search", data.search)
      .set("status", data.status)
      .set("filterObj", JSON.stringify(data.filterObj || {}));

    return this.http.get(`${this.serviceApiUrl}getAllPatient`, { params }).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getPatient(patientId: string) {
    return this.http.get(this.serviceApiUrl + `getPatient/${patientId}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  closePatientQuery(patientId, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.serviceApiUrl + `closePatientQuery/${patientId}`,
      { dataEncrypt }
    );
  }

  openPatientQuery(patientId) {
    return this.http.put(
      this.serviceApiUrl + `openPatientQuery/${patientId}`,
      ""
    );
  }

  deletePatient(id: any) {
    return this.http.delete(this.serviceApiUrl + `deletePatient/${id}`);
  }

  // Query View Setting
  addQueryViewSetting(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addQueryViewSetting", {
      dataEncrypt,
    });
  }
  getAllQueryViewSetting(data: any) {
    const params = new HttpParams()
      .set("limit", data.limit)
      .set("page", data.page)
      .set("search", data.search);
    return this.http
      .get(`${this.serviceApiUrl}getAllQueryViewSetting`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  editQueryViewSetting(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editQueryViewSetting/${id}`, {
      dataEncrypt,
    });
  }
  editSendEmailSetting(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editSendEmailSetting/${id}`, {
      dataEncrypt,
    });
  }
  getQueryViewSetting(id: any) {
    return this.http.get(this.serviceApiUrl + `getQueryViewSetting/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getQueryViewSettingByInternalUser(id: any) {
    return this.http
      .get(this.serviceApiUrl + `getQueryViewSettingByInternalUser/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  deleteQueryViewSetting(id: any) {
    return this.http.delete(
      this.serviceApiUrl + `deleteQueryViewSetting/${id}`
    );
  }

  // Top Hospitals

  addTopHospital(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addTopHospital", {
      dataEncrypt,
    });
  }

  getTopHospital() {
    return this.http.get(`${this.serviceApiUrl}getTopHospital`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  //  Hospital Default Email

  getDefaultEmail(id: string) {
    return this.http.get(this.serviceApiUrl + `getDefaultEmail/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addDefaultEmail(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addDefaultEmail`, {
      dataEncrypt,
    });
  }

  getSupremeDefaultEmail(id: string) {
    return this.http
      .get(this.serviceApiUrl + `getSupremeDefaultEmail/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  // Hospital Email Zone

  addHospitalEmailZone(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addHospitalEmailZone`, {
      dataEncrypt,
    });
  }

  editHospitalEmailZone(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editHospitalEmailZone/${id}`, {
      dataEncrypt,
    });
  }

  getAllHospitalEmailZone(id: string, data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getAllHospitalEmailZone/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllDefaultHospitalEmailZone(id: string, data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getAllDefaultHospitalEmailZone/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getHospitalEmailZone(id: any) {
    return this.http
      .get(this.serviceApiUrl + `getHospitalEmailZone/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteHospitalEmailZone(id: any) {
    return this.http.delete(
      this.serviceApiUrl + `deleteHospitalEmailZone/${id}`
    );
  }

  // Hospital Email Zone Setting

  editHospitalEmailZoneSetting(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editHospitalEmailZoneSetting`, {
      dataEncrypt,
    });
  }

  getHospitalEmailZoneSetting(id: any) {
    return this.http
      .get(this.serviceApiUrl + `getHospitalEmailZoneSetting/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Role and Permission

  getAllRole() {
    return this.http.get(this.serviceApiUrl + `getAllRole`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllPermissionDB() {
    return this.http.get(this.serviceApiUrl + `getAllPermissionDB`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAllPermission() {
    return this.http.get(this.serviceApiUrl + `getAllPermission`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  addUserRolePermission(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addRolePermission`, {
      dataEncrypt,
    });
  }

  editUserRolePermission(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editRolePermission/${id}`, {
      dataEncrypt,
    });
  }

  newEditUserRolePermission(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editRolePermission`, {
      dataEncrypt,
    });
  }

  getPermissionDbById(id: string) {
    return this.http.get(this.serviceApiUrl + `getPermissionDbById/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  deletUserPermission(id: string) {
    return this.http.delete(this.serviceApiUrl + `deleteRolePermssion/${id}`);
  }

  // Referral Partner Details

  addReferralPartnerDetails(data: any) {
    return this.http.post(
      this.serviceApiUrl + "addReferralPartnerDetails",
      data
    );
  }
  editReferralPartnerDetails(data: any) {
    return this.http.put(
      this.serviceApiUrl + "editReferralPartnerDetails",
      data
    );
  }
  getReferralPartnerDetails() {
    return this.http.get(this.serviceApiUrl + "getReferralPartnerDetails").pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // Branch Office Details

  addBranchOfficeDetails(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addBranchOfficeDetails", {
      dataEncrypt,
    });
  }
  editBranchOfficeDetails(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + "editBranchOfficeDetails", {
      dataEncrypt,
    });
  }
  getBranchOfficeDetails() {
    return this.http.get(this.serviceApiUrl + "getBranchOfficeDetails").pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // Query management routes
  getAllOpinionRequest(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllOpinionRequest/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPendingOpinionRequest(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPendingOpinionRequest/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPendingOpdRequest(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPendingOpdRequest/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPendingProformaInvoiceRequest(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPendingProformaInvoiceRequest/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllOpdRequest(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllOpdRequest/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAllOpdReceived(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllOpdReceived/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAllVilReceived(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllVilReceived/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAllProformaInvoiceReceived(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllProformaInvoiceReceived/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllOpinionReceived(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllOpinionReceived/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllOpdReceivedEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllOpdReceivedEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllVilReceivedEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllVilReceivedEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllProformaInvoiceReceivedEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllProformaInvoiceReceivedEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllOpinionReceivedEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllOpinionReceivedEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllPatientConfirmation(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllPatientConfirmation/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllPatientConfirmationEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllPatientConfirmationEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllVilRequest(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllVilRequest/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getPendingVilRequest(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPendingVilRequest/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllPreIntimation(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllPreIntimation/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllProformaInvoiceRequest(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllProformaInvoiceRequest/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  approveOpinionReceived(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}approveOpinionReceived`, {
      dataEncrypt,
    });
  }

  sendOpd(payload: any, params: any = {}) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}sendOpd`,
      { dataEncrypt },
      {
        params: { ...params },
      }
    );
  }
  sendVil(payload: any, params: any = {}) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}sendVil`,
      { dataEncrypt },
      {
        params: { ...params },
      }
    );
  }

  downloadVil(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}downloadVil`, { dataEncrypt });
  }

  downloadProformaInvoice(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}downloadProformaInvoice`, {
      dataEncrypt,
    });
  }
  downloadOpinion(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}downloadOpinion`, {
      dataEncrypt,
    });
  }

  sendProformaInvoice(payload: any, params: any = {}) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}sendProformaInvoice`,
      {
        dataEncrypt,
      },
      {
        params: { ...params },
      }
    );
  }

  sendOpinion(payload: any, params: any = {}) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}sendOpinion`,
      { dataEncrypt },
      {
        params: { ...params },
      }
    );
  }

  approveOpinionReceivedEdited(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}approveOpinionReceivedEdited`, {
      dataEncrypt,
    });
  }

  proformaInvoiceReceived(payload: any) {
    return this.http.post(
      `${this.serviceApiUrl}proformaInvoiceReceived`,
      payload
    );
  }
  opdReceived(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}opdReceived`, { dataEncrypt });
  }

  opdReceivedEdited(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}opdReceivedEdited`, {
      dataEncrypt,
    });
  }
  opinionReceived(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}opinionReceived`, {
      dataEncrypt,
    });
  }
  opinionReceivedEdited(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}opinionReceivedEdited`, {
      dataEncrypt,
    });
  }

  vilReceived(payload: any) {
    return this.http.post(`${this.serviceApiUrl}vilReceived`, payload);
  }
  vilReceivedEdited(payload: any) {
    return this.http.post(`${this.serviceApiUrl}vilReceivedEdited`, payload);
  }

  proformaInvoiceReceivedEdited(payload: any) {
    return this.http.post(
      `${this.serviceApiUrl}proformaInvoiceReceivedEdited`,
      payload
    );
  }

  // addOpinion(payload: any) {
  //   const dataEncrypt = this.sharedService.encrypt(payload);
  //   return this.http.post(`${this.serviceApiUrl}/addOpinionRequest`, {
  //     dataEncrypt,
  //   });
  // }

  resendPatientConfirmation(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}resendPatientConfirmation`, {
      dataEncrypt,
    });
  }

  resendPatientConfirmationEdited(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}resendPatientConfirmationEdited`,
      { dataEncrypt }
    );
  }

  resendVilRequest(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}resendVilRequest`, {
      dataEncrypt,
    });
  }

  resendPreIntimation(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}/resendPreIntimation`, {
      dataEncrypt,
    });
  }

  resendProformaInvoiceRequest(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}/resendProformaInvoiceRequest`,
      { dataEncrypt }
    );
  }

  addPreIntimation(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}/addPreIntimation`, {
      dataEncrypt,
    });
  }

  addProformaInvoiceRequest(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}/addProformaInvoiceRequest`, {
      dataEncrypt,
    });
  }

  // addOpdRequest(payload: any) {
  //   const dataEncrypt = this.sharedService.encrypt(payload);
  //   return this.http.post(`${this.serviceApiUrl}/addOpdRequest`, {
  //     dataEncrypt,
  //   });
  // }

  addpatientConfirmation(payload: any) {
    return this.http.post(`${this.serviceApiUrl}patientConfirmation`, payload);
  }

  patientConfirmationEdited(payload: any) {
    return this.http.post(
      `${this.serviceApiUrl}patientConfirmationEdited`,
      payload
    );
  }

  getOpinionRequestRecipients(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getOpinionRequestRecipients`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getPreIntimationRecipients(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPreIntimationRecipients`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getProformaInvoiceRecipients(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getProformaInvoiceRecipients`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpdRequestRecipients(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}/getOpdRequestRecipients`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientConfirmationRecipients(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}/getPatientConfirmationRecipients`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilRecipients(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}/getVilRecipients`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllOpinionRequestByAggregator(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAllOpinionRequestByAggregator`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllVilRequestByAggregator(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAllVilRequestByAggregator`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllPatientConfirmationByAggregator(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAllPatientConfirmationByAggregator`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPreIntimationRequestByAggregator(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAllPreIntimationByAggregator`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllProformaInvoiceRequestByAggregator(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAllProformaInvoiceRequestByAggregator`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllOpdRequestByAggregator(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAllOpdRequestByAggregator`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // hospital linking
  getOpinionRequestByHospitalOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);

    return this.http
      .get(`${this.serviceApiUrl}getOpinionRequestByHospitalOpenLink`, {
        headers,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientConfirmationByHospitalOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);

    return this.http
      .get(`${this.serviceApiUrl}getPatientConfirmationByHospitalOpenLink`, {
        headers,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpdRequestByHospitalOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);

    return this.http
      .get(`${this.serviceApiUrl}getOpdRequestByHospitalOpenLink`, { headers })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilRequestByHospitalOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);

    return this.http
      .get(`${this.serviceApiUrl}getVilRequestByHospitalOpenLink`, { headers })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getProformaInvoiceRequestByHospitalOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);

    return this.http
      .get(`${this.serviceApiUrl}getProformaInvoiceRequestByHospitalOpenLink`, {
        headers,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  opinionReceivedOpenLink(payload: any) {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}opinionReceivedOpenLink`,
      { dataEncrypt },
      { headers }
    );
  }

  patientConfirmationApprovedOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    return this.http.post(
      `${this.serviceApiUrl}patientConfirmationApprovedOpenLink`,
      null,
      { headers }
    );
  }

  opdReceivedOpenLink(payload: any) {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}opdReceivedOpenLink`,
      { dataEncrypt },
      { headers }
    );
  }

  vilReceivedOpenLink(payload: any) {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    return this.http.post(`${this.serviceApiUrl}vilReceivedOpenLink`, payload, {
      headers,
    });
  }

  proformaInvoiceReceivedOpenLink(payload: any) {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    return this.http.post(
      `${this.serviceApiUrl}proformaInvoiceReceivedOpenLink`,
      payload,
      { headers }
    );
  }

  // doctor link
  addOpinionByDoctorOpenLink(payload: any) {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${environment.hospitalAdminServiceApiUrl}addOpinionByDoctorOpenLink`,
      { dataEncrypt },
      { headers }
    );
  }

  addRecordingByDoctorOpenLink(payload: any) {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    return this.http.post(
      `${environment.hospitalAdminServiceApiUrl}addRecordingByDoctorOpenLink`,
      payload,
      { headers }
    );
  }

  getDoctorOpinionRequestByDoctorOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);

    return this.http
      .get(
        `${environment.hospitalAdminServiceApiUrl}getDoctorOpinionRequestByDoctorOpenLink`,
        {
          headers,
        }
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getDoctorRecordingByHospitalOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    return this.http
      .get(
        `${environment.hospitalAdminServiceApiUrl}getDoctorRecordingByHospitalOpenLink`,
        {
          headers,
        }
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getDoctorOpinionReceivedByHospitalOpenLink() {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);
    return this.http
      .get(
        `${environment.hospitalAdminServiceApiUrl}getDoctorOpinionReceivedByHospitalOpenLink`,
        {
          headers,
        }
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // error logs
  getErrorLogs(data: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllErrorLog`, {
        params: {
          limit: data?.limit,
          page: data?.page,
          search: data?.search,
        },
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // operationBoard Apis

  getFollowUpQuery(payload: any) {
    let search = JSON.stringify(payload?.search);

    return this.http
      .get(
        `${this.serviceApiUrl}getFollowUpQuery?page=${payload?.page}&limit=${
          payload?.limit
        }&search=${search}&filterObj=${JSON.stringify(
          payload.filterObj || {}
        )}&closeFollowUp=${payload?.closeFollowUp}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getPendingQueryList(payload: any) {
    let search = JSON.stringify(payload?.search);

    return this.http
      .get(
        `${this.serviceApiUrl}getPendingQuery?page=${payload?.page}&limit=${
          payload?.limit
        }&search=${search}&filterObj=${JSON.stringify(
          payload.filterObj || {}
        )} `
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getOnGroundQueryList(payload: any) {
    let search = JSON.stringify(payload?.search);

    return this.http
      .get(
        `${this.serviceApiUrl}getOnGroundQuery?page=${payload?.page}&limit=${
          payload?.limit
        }&search=${search}&filterObj=${JSON.stringify(payload.filterObj || {})}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getUpcommingQueryList(payload: any) {
    let search = JSON.stringify(payload?.search);

    return this.http
      .get(
        `${this.serviceApiUrl}getUpcomingArrival?page=${payload?.page}&limit=${
          payload?.limit
        }&search=${search}&filterObj=${JSON.stringify(payload.filterObj || {})}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getFinanceQueryList(payload: any) {
    let search = JSON.stringify(payload?.search);

    return this.http
      .get(
        `${this.serviceApiUrl}getFinanceQuery?page=${payload?.page}&limit=${
          payload?.limit
        }&search=${search}&filterObj=${JSON.stringify(payload.filterObj || {})}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getCompletedQueryList(payload: any) {
    let search = JSON.stringify(payload?.search);

    return this.http
      .get(
        `${this.serviceApiUrl}getCompletedQuery?page=${payload?.page}&limit=${
          payload?.limit
        }&search=${search}&filterObj=${JSON.stringify(payload.filterObj || {})}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getTodayQueryList(payload: any) {
    let search = JSON.stringify(payload?.search);

    return this.http
      .get(
        `${this.serviceApiUrl}getTodayQuery?page=${payload?.page}&limit=${
          payload?.limit
        }&search=${search}&filterObj=${JSON.stringify(payload.filterObj || {})}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getComment(payload: any, id: string) {
    return this.http
      .get(
        `${this.serviceApiUrl}getComment/${id}?page=${payload?.page}&limit=${payload?.limit}&search=${payload?.search} `
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addComment(data: any, id: string) {
    return this.http.post(this.serviceApiUrl + `addComment/${id}`, data);
  }

  // dashboard comment list
  getAllComment(payload: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllComment?page=${payload?.page}&limit=${payload?.limit}&search=${payload?.search}&isNotification=${payload?.isNotification}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  readComment(id: any) {
    return this.http.get(`${this.serviceApiUrl}readComment/${id}`).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getUnReadCommentCount() {
    return this.http.get(`${this.serviceApiUrl}getUnReadCommentCount`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // Comment Setting
  addPushNotificationEndpoint(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(this.serviceApiUrl + `addPushNotificationEndpoint`, {
      dataEncrypt,
    });
  }

  getCommentSetting() {
    return this.http.get(`${this.serviceApiUrl}getCommentSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addCommentSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(this.serviceApiUrl + `addCommentSetting`, {
      dataEncrypt,
    });
  }

  editCommentSetting(id: string, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(this.serviceApiUrl + `editCommentSetting/${id}`, {
      dataEncrypt,
    });
  }

  moveToCompletedQuery(id: string, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(this.serviceApiUrl + `moveToCompletedQuery/${id}`, {
      dataEncrypt,
    });
  }

  moveToFinanceQuery(id: string, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(this.serviceApiUrl + `moveToFinanceQuery/${id}`, {
      dataEncrypt,
    });
  }

  getPatientItinerary(id: string) {
    return this.http.get(`${this.serviceApiUrl}getPatientItinerary/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addPatientItinerary(payload: any) {
    return this.http.post(this.serviceApiUrl + `addPatientItinerary`, payload);
  }

  getPatientOperationStatus(id: string, params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getPatientOperationStatus/${id}?page=${params?.page}&limit=${params?.limit}&search=${params?.search}&type=${params?.type}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // download api operation board

  downloadTodayQuery() {
    return this.http.post(`${this.serviceApiUrl}downloadTodayQuery`, null).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  downloadPendingQuery() {
    return this.http
      .post(`${this.serviceApiUrl}downloadPendingQuery`, null)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  downloadUpcomingArrival() {
    return this.http
      .post(`${this.serviceApiUrl}downloadUpcomingArrival`, null)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  downloadFinanceQuery() {
    return this.http
      .post(`${this.serviceApiUrl}downloadFinanceQuery`, null)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  downloadOnGroundQuery() {
    return this.http
      .post(`${this.serviceApiUrl}downloadOnGroundQuery`, null)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  downloadFollowUpQuery(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}downloadFollowUpQuery`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addPatientOperationStatus(id: string, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      this.serviceApiUrl + `addPatientOperationStatus/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  // notification api
  getNotificationSetting() {
    return this.http.get(`${this.serviceApiUrl}getNotificationSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addNotificationSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(this.serviceApiUrl + `addNotificationSetting`, {
      dataEncrypt,
    });
  }

  editNotificationSetting(id: string, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(this.serviceApiUrl + `editNotificationSetting/${id}`, {
      dataEncrypt,
    });
  }

  // email send setting
  getEmailSendSetting(id: any) {
    return this.http.get(this.serviceApiUrl + `getEmailSendSetting/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res?.data);
        return res;
      })
    );
  }

  addEmailSendSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(this.serviceApiUrl + `addEmailSendSetting`, {
      dataEncrypt,
    });
  }

  editEmailSendSetting(id: string, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(this.serviceApiUrl + `editEmailSendSetting/${id}`, {
      dataEncrypt,
    });
  }

  // bank details

  getBankDetails() {
    return this.http.get(`${this.serviceApiUrl}getBankDetails`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addBankDetails(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(this.serviceApiUrl + `addBankDetails`, {
      dataEncrypt,
    });
  }

  editBankDetails(payload: any, id: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(this.serviceApiUrl + `editBankDetails/${id}`, {
      dataEncrypt,
    });
  }

  // query management new

  // ---- opinion ----
  getAllAddedOpinion(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllAddedOpinion/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAllAddedOpinionEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllAddedOpinionEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  addOpinionRequest(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addOpinionRequest`, {
      dataEncrypt,
    });
  }
  addOpinion(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addOpinion`, {
      dataEncrypt,
    });
  }
  addOpinionEdited(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addOpinionEdited`, {
      dataEncrypt,
    });
  }

  resendOpinionRequest(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}resendOpinionRequest`, {
      dataEncrypt,
    });
  }

  // ---- opd ----
  addOpdRequest(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addOpdRequest`, {
      dataEncrypt,
    });
  }

  getAllAddedOpd(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllAddedOpd/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllAddedOpdEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllAddedOpdEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addOpd(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addOpd`, {
      dataEncrypt,
    });
  }

  addOpdEdited(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addOpdEdited`, {
      dataEncrypt,
    });
  }

  resendOpdRequest(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}resendOpdRequest`, {
      dataEncrypt,
    });
  }
  // ---- vil ----
  addVilRequest(payload: any) {
    return this.http.post(`${this.serviceApiUrl}addVilRequest`, payload);
  }
  editVilRequest(payload: any) {
    return this.http.post(`${this.serviceApiUrl}editVilRequest`, payload);
  }

  getAllAddedVil(id: any) {
    return this.http.get(`${this.serviceApiUrl}getAllAddedVil/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAllAddedVilEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllAddedVilEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addVil(payload: any) {
    return this.http.post(`${this.serviceApiUrl}addVil`, payload);
  }

  addVilEdited(payload: any) {
    return this.http.post(`${this.serviceApiUrl}addVilEdited`, payload);
  }

  // ---- patient confirmation ----
  getAllAddedPatientConfirmation(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllAddedPatientConfirmation/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllAddedPatientConfirmationEdited(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllAddedPatientConfirmationEdited/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addPatientConfirmation(payload: any) {
    return this.http.post(
      `${this.serviceApiUrl}addPatientConfirmation`,
      payload
    );
  }

  addPatientConfirmationEdited(payload: any) {
    return this.http.post(
      `${this.serviceApiUrl}addPatientConfirmationEdited`,
      payload
    );
  }

  // vil setting
  getVilSetting() {
    return this.http.get(`${this.serviceApiUrl}getVilSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addVilSetting(payload: any) {
    return this.http.post(`${this.serviceApiUrl}addVilSetting`, payload);
  }

  editVilSetting(payload: any, params = {}) {
    return this.http.put(`${this.serviceApiUrl}editVilSetting`, payload, {
      params: { ...params },
    });
  }

  deleteVilSetting(id: any) {
    return this.http.put(`${this.serviceApiUrl}deleteVilSetting/${id}`, null);
  }

  // issued vil api's
  getAllIssuedVil(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllIssuedVil?page=${params?.page}&limit=${
          params?.limit
        }&search=${params?.search}&filterObj=${JSON.stringify(
          params?.filterObj || []
        )}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getIssuedVil(id: any) {
    return this.http.get(`${this.serviceApiUrl}getIssuedVil/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  verifyIssuedVil(payload: any) {
    return this.http.post(`${this.serviceApiUrl}verifyIssuedVil`, payload);
  }

  // treating doctor apis
  assignOpinionRequestToDoctor(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}assignOpinionRequestToDoctor`, {
      dataEncrypt,
    });
  }

  addOpinionByDoctor(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addOpinionByDoctor`, {
      dataEncrypt,
    });
  }

  addRecordingByDoctor(payload: any) {
    return this.http.post(`${this.serviceApiUrl}addRecordingByDoctor`, payload);
  }

  getAllRecordingByDoctor(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllRecordingByDoctor/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPendingOpinionRequestByDoctor(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPendingOpinionRequestByDoctor/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllOpinionRequestByDoctor(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllOpinionRequestByDoctor/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllAddedOpinionByDoctor(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllAddedOpinionByDoctor/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getDoctorOpinionRequestByHospital() {
    return this.http
      .get(`${this.serviceApiUrl}getDoctorOpinionRequestByHospital`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getDoctorOpinionReceivedByHospital() {
    return this.http
      .get(`${this.serviceApiUrl}getDoctorOpinionReceivedByHospital`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllPatientConfirmationTicket(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}getAllPatientConfirmationTicket`,
      { dataEncrypt }
    );
  }

  checkSentVil(id: any) {
    return this.http.get(this.serviceApiUrl + `checkSentVil/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllSentVil(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllSentVil?page=${params?.page}&limit=${
          params?.limit
        }&search=${params?.search}&filterObj=${JSON.stringify(
          params?.filterObj || []
        )}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Email fetch Setting Api's
  getAllEmailFetchSetting(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllEmailFetchSetting?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getEmailFetchSetting(id: any) {
    return this.http.get(`${this.serviceApiUrl}getEmailFetchSetting/${id}`);
  }

  addEmailFetchSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addEmailFetchSetting`, {
      dataEncrypt,
    });
  }

  editEmailFetchSetting(payload: any, id: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(`${this.serviceApiUrl}editEmailFetchSetting/${id}`, {
      dataEncrypt,
    });
  }

  deleteEmailFetchSetting(id: any) {
    return this.http.delete(
      `${this.serviceApiUrl}deleteEmailFetchSetting/${id}`
    );
  }

  getAllEmailFetchSettingForFilter(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllEmailFetchSettingForFilter?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllEmailFetch(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllEmailFetch?page=${params?.page}&limit=${
          params?.limit
        }&search=${params?.search}&origin=${JSON.stringify(params?.origin)}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getEmailFetch(id: any) {
    return this.http.get(`${this.serviceApiUrl}getEmailFetch/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getPatientDataByEmailFetch(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPatientDataByEmailFetch/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getUnreadEmailFetchCount() {
    return this.http.get(`${this.serviceApiUrl}getUnreadEmailFetchCount`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllEmployeeUserForHopsital(queryParams: any) {
    return this.http
      .get(this.serviceApiUrl + `getInternalUserByUserType`, {
        params: queryParams,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // download doctor profile
  downloadDoctorProfile(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}downloadDoctorProfile`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          // res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientNameByEmailFetch(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPatientNameByEmailFetch/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientConfirmationDataByEmailFetch(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getPatientConfirmationDataByEmailFetch/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilDataByEmailFetch(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getVilDataByEmailFetch/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddVilDataByEmailFetch(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAddVilDataByEmailFetch/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpdDataByEmailFetch(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAddOpdDataByEmailFetch/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpinionDataByEmailFetch(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAddOpinionDataByEmailFetch/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpinionDataByImageRead(payload: any, id: string) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAddOpinionDataByImageRead/${id}`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpinionDataByFileRead(payload: any, id: string) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAddOpinionDataByFileRead/${id}`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // doctor staff api
  addDoctorStaff(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addDoctorStaff`, {
      dataEncrypt,
    });
  }

  editDoctorStaff(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editDoctorStaff/${id}`, {
      dataEncrypt,
    });
  }

  getAllDoctorStaff(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getAllDoctorStaff`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getDoctorStaff(id: any) {
    return this.http.get(this.serviceApiUrl + `getDoctorStaff/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getDoctorStaffByType(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("type", data.type)
      .set("doctor", data.doctor)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getDoctorStaffByType`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getStaffByDoctor(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("type", data.type)
      .set("doctor", data.doctor)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getStaffByDoctor`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteDoctorStaff(id: any) {
    return this.http.delete(this.serviceApiUrl + `deleteDoctorStaff/${id}`);
  }

  addDoctorDefaultEmail(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addDoctorDefaultEmail`, {
      dataEncrypt,
    });
  }

  getDoctorDefaultEmail(id: any) {
    return this.http
      .get(this.serviceApiUrl + `getDoctorDefaultEmail/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // doctor default message
  addDoctorDefaultMessage(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addDoctorDefaultMessage`, {
      dataEncrypt,
    });
  }

  getDoctorDefaultMessage(id: any) {
    return this.http
      .get(this.serviceApiUrl + `getDoctorDefaultMessage/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Email Communication Setting Api's
  getAllEmailSetting(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllEmailSetting?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getEmailSetting(id: any) {
    return this.http.get(`${this.serviceApiUrl}getEmailSetting/${id}`);
  }

  addEmailSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addEmailSetting`, {
      dataEncrypt,
    });
  }

  editEmailSetting(payload: any, id: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(`${this.serviceApiUrl}editEmailSetting/${id}`, {
      dataEncrypt,
    });
  }

  deleteEmailSetting(id: any) {
    return this.http.delete(`${this.serviceApiUrl}deleteEmailSetting/${id}`);
  }

  // default email for communication api
  getAllEmailSettingByUser(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllEmailSettingByUser/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getEmailCommunicationDefaultEmail(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getEmailCommunicationDefaultEmail/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addEmailCommunicationDefaultEmail(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}addEmailCommunicationDefaultEmail`,
      {
        dataEncrypt,
      }
    );
  }

  editEmailCommunicationDefaultEmail(payload: any, id: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(
      `${this.serviceApiUrl}editEmailCommunicationDefaultEmail/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  // treatment package api's

  getAllTreatmentPackage(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllTreatmentPackage?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllTreatmentPackageByDoctor(params: any, id: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllTreatmentPackageByDoctor/${id}?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllTreatmentPackageByDoctorOpenLink(params: any, id: any) {
    const loginLinkToken = localStorage.getItem("loginLinkToken");
    const headers = new HttpHeaders().set("login_link_token", loginLinkToken);

    return this.http
      .get(
        `${environment.hospitalAdminServiceApiUrl}getAllTreatmentPackageByDoctorOpenLink/${id}?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`,
        {
          headers,
        }
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getTreatmentPackage(id: any) {
    return this.http.get(`${this.serviceApiUrl}getTreatmentPackage/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addTreatmentPackage(payload: any) {
    return this.http.post(`${this.serviceApiUrl}addTreatmentPackage`, payload);
  }

  editTreatmentPackage(payload: any, id: any) {
    return this.http.put(
      `${this.serviceApiUrl}editTreatmentPackage/${id}`,
      payload
    );
  }

  deleteTreatmentPackage(id: any) {
    return this.http.delete(
      `${this.serviceApiUrl}deleteTreatmentPackage/${id}`
    );
  }

  // acknowledgement setting
  addAcknowledgementSetting(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addAcknowledgementSetting", {
      dataEncrypt,
    });
  }

  editAcknowledgementSetting(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.serviceApiUrl + `editAcknowledgementSetting/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getAcknowledgementSetting() {
    return this.http.get(this.serviceApiUrl + `getAcknowledgementSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  sendAcknowledgement(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "sendAcknowledgement", {
      dataEncrypt,
    });
  }

  // followup setting
  addFollowUpSetting(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addFollowUpSetting", {
      dataEncrypt,
    });
  }

  closeFollowUp(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "closeFollowUp", {
      dataEncrypt,
    });
  }

  editFollowUpSetting(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editFollowUpSetting/${id}`, {
      dataEncrypt,
    });
  }

  getFollowUpSetting() {
    return this.http.get(this.serviceApiUrl + `getFollowUpSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addFollowUp(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + "addFollowUp", {
      dataEncrypt,
    });
  }

  // Message Content

  getAllMessageContent() {
    return this.http.get(this.serviceApiUrl + `getAllMessageContent`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllDefaultMessageContent() {
    return this.http
      .get(this.serviceApiUrl + `getAllDefaultMessageContent`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getMessageContent(id: any) {
    return this.http.get(this.serviceApiUrl + `getMessageContent/${id}`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  deleteMessageContent(id: any) {
    return this.http.delete(this.serviceApiUrl + `deleteMessageContent/${id}`);
  }

  addMessageContent(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);

    return this.http.post(this.serviceApiUrl + `addMessageContent`, {
      dataEncrypt,
    });
  }

  editMessageContent(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editMessageContent/${id}`, {
      dataEncrypt,
    });
  }

  getMessageContentModule() {
    return this.http.get(this.serviceApiUrl + `getMessageContentModule`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  // communication setting
  getCommunicationSetting() {
    return this.http.get(`${this.serviceApiUrl}getCommunicationSetting`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addCommunicationSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(this.serviceApiUrl + `addCommunicationSetting`, {
      dataEncrypt,
    });
  }

  editCommunicationSetting(id: string, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(
      this.serviceApiUrl + `editCommunicationSetting/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  // Message Communication Setting Api's
  getAllMessageSetting(params: any) {
    return this.http
      .get(
        `${this.serviceApiUrl}getAllMessageSetting?page=${params?.page}&limit=${params?.limit}&search=${params?.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getMessageSetting(id: any) {
    return this.http.get(`${this.serviceApiUrl}getMessageSetting/${id}`);
  }

  addMessageSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addMessageSetting`, {
      dataEncrypt,
    });
  }

  editMessageSetting(payload: any, id: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(`${this.serviceApiUrl}editMessageSetting/${id}`, {
      dataEncrypt,
    });
  }

  deleteMessageSetting(id: any) {
    return this.http.delete(`${this.serviceApiUrl}deleteMessageSetting/${id}`);
  }

  // default message for communication api
  getAllMessageSettingByUser(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getAllMessageSettingByUser/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getMessageCommunicationDefaultMessage(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getMessageCommunicationDefaultMessage/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addMessageCommunicationDefaultMessage(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(
      `${this.serviceApiUrl}addMessageCommunicationDefaultMessage`,
      {
        dataEncrypt,
      }
    );
  }

  editMessageCommunicationDefaultMessage(payload: any, id: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(
      `${this.serviceApiUrl}editMessageCommunicationDefaultMessage/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  // message send setting
  getMessageSendSetting(id: any) {
    return this.http
      .get(`${this.serviceApiUrl}getMessageSendSetting/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addMessageSendSetting(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.post(`${this.serviceApiUrl}addMessageSendSetting`, {
      dataEncrypt,
    });
  }

  editMessageSendSetting(id: any, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http.put(`${this.serviceApiUrl}editMessageSendSetting/${id}`, {
      dataEncrypt,
    });
  }

  // whatsapp ai api
  getMessageFetch() {
    return this.http.get(`${this.serviceApiUrl}getMessageFetch`);
    // .pipe(
    //   map((res: any) => {
    //     res.data = this.sharedService.decrypt(res.data);
    //     return res;
    //   })
    // );
  }

  getPatientDataByMessageFetch(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPatientDataByMessageFetch`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientNameByMessageFetch(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPatientNameByMessageFetch`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientConfirmationDataByMessageFetch(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPatientConfirmationDataByMessageFetch`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilDataByMessageFetch(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getVilDataByMessageFetch`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddVilDataByMessageFetch(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAddVilDataByMessageFetch`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpinionDataByMessageFetch(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAddOpinionDataByMessageFetch`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpdDataByMessageFetch(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAddOpdDataByMessageFetch`, { dataEncrypt })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpinionDataByMessageImageRead(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAddOpinionDataByMessageImageRead`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAddOpinionDataByMessageFileRead(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getAddOpinionDataByMessageFileRead`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientDataByMessageImageRead(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPatientDataByMessageImageRead`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientDataByMessageFileRead(payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPatientDataByMessageFileRead`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Referral Partner Staff

  addReferralPartnerStaff(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addReferralPartnerStaff`, {
      dataEncrypt,
    });
  }

  editReferralPartnerStaff(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.serviceApiUrl + `editReferralPartnerStaff/${id}`,
      { dataEncrypt }
    );
  }

  getAllReferralPartnerStaff(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getAllReferralPartnerStaff`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getReferralPartnerStaff(id: any) {
    return this.http
      .get(this.serviceApiUrl + `getReferralPartnerStaff/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getStaffByReferralPartner(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("referralPartner", data.referralPartner)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getStaffByReferralPartner`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteReferralPartnerStaff(id: any) {
    return this.http.delete(
      this.serviceApiUrl + `deleteReferralPartnerStaff/${id}`
    );
  }

  addReferralPartnerZone(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addReferralPartnerZone`, {
      dataEncrypt,
    });
  }

  editReferralPartnerZone(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editReferralPartnerZone/${id}`, {
      dataEncrypt,
    });
  }

  getAllReferralPartnerZone(id: string, data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.serviceApiUrl + `getAllReferralPartnerZone/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getReferralPartnerZone(id: any) {
    return this.http
      .get(this.serviceApiUrl + `getReferralPartnerZone/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteReferralPartnerZone(id: any) {
    return this.http.delete(
      this.serviceApiUrl + `deleteReferralPartnerZone/${id}`
    );
  }

  //  referral partner Default Email

  getReferralPartnerDefaultEmail(id: string) {
    return this.http
      .get(this.serviceApiUrl + `getReferralPartnerDefaultEmail/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addReferralPartnerDefaultEmail(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.serviceApiUrl + `addReferralPartnerDefaultEmail`,
      {
        dataEncrypt,
      }
    );
  }

  //  referral partner Default Message

  getReferralPartnerDefaultMessage(id: string) {
    return this.http
      .get(this.serviceApiUrl + `getReferralPartnerDefaultMessage/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addReferralPartnerDefaultMessage(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.serviceApiUrl + `addReferralPartnerDefaultMessage`,
      {
        dataEncrypt,
      }
    );
  }

  getPatientDataByEmailImageRead(id: any, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPatientDataByEmailImageRead/${id}`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientDataByEmailFileRead(id: any, payload: any) {
    const dataEncrypt = this.sharedService.encrypt(payload);
    return this.http
      .post(`${this.serviceApiUrl}getPatientDataByEmailFileRead/${id}`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // dashboard revamp api's
  getAllDasboardCards() {
    return this.http.get(this.serviceApiUrl + `getAllDasboardCards`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllSelectedFilter() {
    return this.http.get(this.serviceApiUrl + `getAllSelectedFilter`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  addSelectedDashboardFilter(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http
      .post(this.serviceApiUrl + `addSelectedDashboardFilter`, {
        dataEncrypt,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getQueryBarChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getQueryBarChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpinionBarChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpinionBarChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilBarChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getVilBarChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getConfirmationBarChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getConfirmationBarChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getTotalMultiLineChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getTotalMultiLineChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getGenderDiversityPieChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getGenderDiversityPieChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getCountryPieChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getCountryPieChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPatientByStatusBarChart(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getPatientByStatusBarChart`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getJourneyFromOpinionFunnelChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getJourneyFromOpinionFunnelChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getJourneyFromVilFunnelChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getJourneyFromVilFunnelChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getDirectConfiramtionFunnelChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getDirectConfiramtionFunnelChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getJourneyFromOpinionToConfirmationFunnelChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(
        this.serviceApiUrl +
          `getJourneyFromOpinionToConfirmationFunnelChartData`,
        {
          params,
        }
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getDepartmentAndTreatmentTreeMapChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getDepartmentAndTreatmentTreeMapChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getQueryCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getQueryCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpinionCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpinionCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getVilCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getConfirmationCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getConfirmationCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getPendingQueryCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getPendingQueryCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpenFollowUpCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpenFollowUpCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getUpcommingArrivalCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getUpcommingArrivalCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOnGroundCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOnGroundCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpinionToVilCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpinionToVilCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilToConfirmationCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getVilToConfirmationCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpinionToConfirmationCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpinionToConfirmationCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getVilTatCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getVilTatCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpinionAssignedTatCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpinionAssignedTatCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpinionRecdTatCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpinionRecdTatCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOpinionSentTatCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOpinionSentTatCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOverAllOpinionTatCountForTopCards(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOverAllOpinionTatCountForTopCards`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOverAllVilTatMultiLineChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOverAllVilTatMultiLineChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getOverAllOpinionTatMultiLineChartData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getOverAllOpinionTatMultiLineChartData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getCountryMapData(filter_obj: any) {
    const params = new HttpParams().set(
      "filter_obj",
      JSON.stringify(filter_obj || {})
    );

    return this.http
      .get(this.serviceApiUrl + `getCountryMapData`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // finance module

  // master setting api's
  addCompanyMaster(data: any) {
    // const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addCompanyMaster`, data);
  }

  editCompanyMaster(id: any, data: any) {
    // const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editCompanyMaster/${id}`, data);
  }

  getAllCompanyMasterData(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllCompanyMasterData`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // hospital payout
  addOpHospitalPayout(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addOpHospitalPayout`, {
      dataEncrypt,
    });
  }

  editOpHospitalPayout(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editOpHospitalPayout/${id}`, {
      dataEncrypt,
    });
  }

  getAllOpHospitalPayoutData(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllOpHospitalPayoutData/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addIpHospitalPayout(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addIpHospitalPayout`, {
      dataEncrypt,
    });
  }

  editIpHospitalPayout(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editIpHospitalPayout/${id}`, {
      dataEncrypt,
    });
  }

  getAllIpHospitalPayoutData(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllIpHospitalPayoutData/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addPackageHospitalPayout(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addPackageHospitalPayout`, {
      dataEncrypt,
    });
  }

  editPackageHospitalPayout(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.serviceApiUrl + `editPackageHospitalPayout/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getAllPackageHospitalPayoutData(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllPackageHospitalPayoutData/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // partner payout
  addOpPartnerPayout(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addOpPartnerPayout`, {
      dataEncrypt,
    });
  }

  editOpPartnerPayout(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editOpPartnerPayout/${id}`, {
      dataEncrypt,
    });
  }

  getAllOpPartnerPayoutData(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllOpPartnerPayoutData/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addIpPartnerPayout(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addIpPartnerPayout`, {
      dataEncrypt,
    });
  }

  editIpPartnerPayout(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.serviceApiUrl + `editIpPartnerPayout/${id}`, {
      dataEncrypt,
    });
  }

  getAllIpPartnerPayoutData(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllIpPartnerPayoutData/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addPackagePartnerPayout(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.serviceApiUrl + `addPackagePartnerPayout`, {
      dataEncrypt,
    });
  }

  editPackagePartnerPayout(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.serviceApiUrl + `editPackagePartnerPayout/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getAllPackagePartnerPayoutData(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllPackagePartnerPayoutData/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // billing entries api's
  addHospitalUhidForFinanceBilling(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.serviceApiUrl + `addHospitalUhidForFinanceBilling`,
      {
        dataEncrypt,
      }
    );
  }

  editHospitalUhidForFinanceBilling(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.serviceApiUrl + `editHospitalUhidForFinanceBilling/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getAllHospitalUhidForFinanceBilling(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllHospitalUhidForFinanceBilling/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getHospitalUhidForFinanceBillingById(id: any, data: any) {
    const params = new HttpParams().set("hospitalId", data.hospitalId);

    return this.http
      .get(this.serviceApiUrl + `getHospitalUhidForFinanceBillingById/${id}`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addBillingDocForFinanceBilling(data: any) {
    return this.http.post(
      this.serviceApiUrl + `addBillingDocForFinanceBilling`,
      data
    );
  }

  editBillingDocForFinanceBilling(id: any, data: any) {
    return this.http.put(
      this.serviceApiUrl + `editBillingDocForFinanceBilling/${id}`,
      data
    );
  }

  getAllBillingDocForFinanceBilling(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllBillingDocForFinanceBilling/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getBillingDocForFinanceBillingById(id: any, data: any) {
    const params = new HttpParams().set("hospitalId", data.hospitalId);

    return this.http
      .get(this.serviceApiUrl + `getBillingDocForFinanceBillingById/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addAdmissionDischargeTrackerForFinanceBilling(data: any) {
    return this.http.post(
      this.serviceApiUrl + `addAdmissionDischargeTrackerForFinanceBilling`,
      data
    );
  }

  editAdmissionDischargeTrackerForFinanceBilling(id: any, data: any) {
    return this.http.put(
      this.serviceApiUrl +
        `editAdmissionDischargeTrackerForFinanceBilling/${id}`,
      data
    );
  }

  getAllAdmissionDischargeTrackerForFinanceBilling(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(
        this.serviceApiUrl +
          `getAllAdmissionDischargeTrackerForFinanceBilling/${id}`,
        {
          params: params,
        }
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAdmissionDischargeTrackerForFinanceBillingById(id: any, data: any) {
    const params = new HttpParams().set("hospitalId", data.hospitalId);

    return this.http
      .get(
        this.serviceApiUrl +
          `getAdmissionDischargeTrackerForFinanceBillingById/${id}`,
        {
          params: params,
        }
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addEstimateDocForFinanceBilling(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.serviceApiUrl + `addEstimateDocForFinanceBilling`,
      {
        dataEncrypt,
      }
    );
  }

  editEstimateDocForFinanceBilling(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.serviceApiUrl + `editEstimateDocForFinanceBilling/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getAllEstimateDocForFinanceBilling(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllEstimateDocForFinanceBilling/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getEstimateDocForFinanceBillingById(id: any, data: any) {
    const params = new HttpParams().set("hospitalId", data.hospitalId);

    return this.http
      .get(this.serviceApiUrl + `getEstimateDocForFinanceBillingById/${id}`, {
        params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addFinalBillForFinanceBilling(data: any) {
    return this.http.post(
      this.serviceApiUrl + `addFinalBillForFinanceBilling`,
      data
    );
  }

  editFinalBillForFinanceBilling(id: any, data: any) {
    return this.http.put(
      this.serviceApiUrl + `editFinalBillForFinanceBilling/${id}`,
      data
    );
  }

  getAllFinalBillForFinanceBilling(data: any, id: string) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search)
      .set("filter_obj", JSON.stringify(data?.filter_obj || {}));
    return this.http
      .get(this.serviceApiUrl + `getAllFinalBillForFinanceBilling/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getFinalBillForFinanceBillingById(id: any, data: any) {
    const params = new HttpParams().set("hospitalId", data.hospitalId);

    return this.http
      .get(this.serviceApiUrl + `getFinalBillForFinanceBillingById/${id}`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
}
