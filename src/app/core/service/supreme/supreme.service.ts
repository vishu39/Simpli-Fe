import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SharedService } from "../shared/shared.service";
@Injectable({
  providedIn: "root",
})
export class SupremeService {
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private sharedService: SharedService
  ) {}

  readonly supremeServiceApiUrl = environment.supremeServiceApiUrl;

  login(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + "login", { dataEncrypt }).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );;
  }

  verifyOtp(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + "verifyOtp", { dataEncrypt });
  }

  // Users

  addUser(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + "addUser", {
      dataEncrypt,
    });
  }
  editUser(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.supremeServiceApiUrl + `editUser/${id}`, {
      dataEncrypt,
    });
  }
  getAllUser(data: any) {
    return this.http
      .get(
        this.supremeServiceApiUrl +
          `getAllUser?page=${data.page}&limit=${data.limit}&search=${data.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  deleteUser(id: any) {
    return this.http.delete(this.supremeServiceApiUrl + `deleteUser/${id}`);
  }

  // Role and Permission

  getAllRole() {
    return this.http.get(this.supremeServiceApiUrl + `getAllRole`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getAllPermissionDB() {
    return this.http.get(this.supremeServiceApiUrl + `getAllPermissionDB`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getAllPermission(data: any) {
    return this.http
      .get(this.supremeServiceApiUrl + `getAllPermission`, {
        params: data,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  addUserRolePermission(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addRolePermission`, {
      dataEncrypt,
    });
  }
  editUserRolePermission(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editRolePermission/${id}`,
      { dataEncrypt }
    );
  }

  getPermissionDbById(id: string, data: any) {
    return this.http
      .get(this.supremeServiceApiUrl + `getPermissionDbById/${id}`, {
        params: data,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  deletUserPermission(id: string) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteRolePermssion/${id}`
    );
  }

  // Customers

  addCustomer(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + "addCustomer", {
      dataEncrypt,
    });
  }
  pushCustomerCredential(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.supremeServiceApiUrl + "pushCustomerCredential",
      { dataEncrypt }
    );
  }
  editCustomer(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.supremeServiceApiUrl + `editCustomer/${id}`, {
      dataEncrypt,
    });
  }
  getAllCustomer(data: any) {
    return this.http
      .get(
        this.supremeServiceApiUrl +
          `getAllCustomer?page=${data.page}&limit=${data.limit}&search=${data.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllFacilitator(data: any) {
    return this.http
      .get(
        this.supremeServiceApiUrl +
          `getAllFacilitator?page=${data.page}&limit=${data.limit}&search=${data.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllProductFamily() {
    return this.http
      .get(this.supremeServiceApiUrl + `getAllProductFamily`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllPlans(familyId: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getAllPlans?familyId=${familyId}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  getAllPlanCurrency() {
    return this.http.get(this.supremeServiceApiUrl + `getAllPlanCurrency`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }
  getPlanPrice(planId: string, currency: string) {
    return this.http
      .get(
        this.supremeServiceApiUrl +
          `getPlanPrice?planId=${planId}&currency=${currency}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }
  deleteCustomer(id: any) {
    return this.http.delete(this.supremeServiceApiUrl + `deleteCustomer/${id}`);
  }

  // Email Content

  getAllEmailContent() {
    return this.http.get(this.supremeServiceApiUrl + `getAllEmailContent`).pipe(
      map((res: any) => {
        res.data = this.sharedService.decrypt(res.data);
        return res;
      })
    );
  }

  getEmailContent(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getEmailContent/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteEmailContent(id: string) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteEmailContent/${id}`
    );
  }

  addEmailContent(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addEmailContent`, {
      dataEncrypt,
    });
  }

  editEmailContent(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(this.supremeServiceApiUrl + `editEmailContent/${id}`, {
      dataEncrypt,
    });
  }

  getEmailContentModule() {
    return this.http
      .get(this.supremeServiceApiUrl + `getEmailContentModule`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Hospital Staff

  addHospitalStaff(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addHospitalStaff`, {
      dataEncrypt,
    });
  }

  editHospitalStaff(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editHospitalStaff/${id}`,
      { dataEncrypt }
    );
  }

  getAllHospitalStaff(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.supremeServiceApiUrl + `getAllHospitalStaff`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getHospitalStaff(id: any) {
    return this.http
      .get(this.supremeServiceApiUrl + `getHospitalStaff/${id}`)
      .pipe(
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
      .get(this.supremeServiceApiUrl + `getStaffByType`, { params })
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
      .get(this.supremeServiceApiUrl + `getStaffByHospital`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteHospitalStaff(id: any) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteHospitalStaff/${id}`
    );
  }

  //  Hospital Default Email

  getDefaultEmail(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getDefaultEmail/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addDefaultEmail(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addDefaultEmail`, {
      dataEncrypt,
    });
  }

  //  Hospital Default Message

  getDefaultMessage(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getDefaultMessage/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addDefaultMessage(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addDefaultMessage`, {
      dataEncrypt,
    });
  }

  // Hospital Email Zone

  addHospitalEmailZone(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addHospitalEmailZone`, {
      dataEncrypt,
    });
  }

  editHospitalEmailZone(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editHospitalEmailZone/${id}`,
      { dataEncrypt }
    );
  }

  getAllHospitalEmailZone(id: string, data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.supremeServiceApiUrl + `getAllHospitalEmailZone/${id}`, {
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
      .get(this.supremeServiceApiUrl + `getHospitalEmailZone/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteHospitalEmailZone(id: any) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteHospitalEmailZone/${id}`
    );
  }

  //  Hospital Password

  generateAllHospitalPassword() {
    return this.http.post(
      this.supremeServiceApiUrl + `generateAllHospitalPassword`,
      ""
    );
  }

  sendPasswordEmailToHospital(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.supremeServiceApiUrl + `sendPasswordEmailToHospital`,
      { dataEncrypt }
    );
  }

  editHospitalPassword(id: string, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editHospitalPassword/${id}`,
      { dataEncrypt }
    );
  }

  getAllHospitalPassword(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.supremeServiceApiUrl + `getAllHospitalPassword`, {
        params: params,
      })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // email content hospital
  getAllEmailContentHospital() {
    return this.http
      .get(this.supremeServiceApiUrl + `getAllEmailContentHospital`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getEmailContentHospital(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getEmailContentHospital/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteEmailContentHospital(id: string) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteEmailContentHospital/${id}`
    );
  }

  addEmailContentHospital(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.supremeServiceApiUrl + `addEmailContentHospital`,
      {
        dataEncrypt,
      }
    );
  }

  editEmailContentHospital(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editEmailContentHospital/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getEmailContentModuleHospital() {
    return this.http
      .get(this.supremeServiceApiUrl + `getEmailContentModuleHospital`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getAllHospital(data: any) {
    return this.http
      .get(
        this.supremeServiceApiUrl +
          `getAllHospital?page=${data.page}&limit=${data.limit}&search=${data.search}`
      )
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getHospitalTemplateEvent() {
    return this.http
      .get(this.supremeServiceApiUrl + `getHospitalTemplateEvent`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getHospitalTemplate(_id: any) {
    return this.http
      .get(this.supremeServiceApiUrl + `getHospitalTemplate/${_id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addHospitalTemplate(data) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addHospitalTemplate`, {
      dataEncrypt,
    });
  }

  // Message Content Hospital

  getAllMessageContentHos() {
    return this.http
      .get(this.supremeServiceApiUrl + `getAllMessageContentHos`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getMessageContentHos(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getMessageContentHos/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteMessageContentHos(id: string) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteMessageContentHos/${id}`
    );
  }

  addMessageContentHos(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addMessageContentHos`, {
      dataEncrypt,
    });
  }

  editMessageContentHos(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editMessageContentHos/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getMessageContentModuleHos() {
    return this.http
      .get(this.supremeServiceApiUrl + `getMessageContentModuleHos`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  // Message Content Facilitator

  getAllMessageContentFac() {
    return this.http
      .get(this.supremeServiceApiUrl + `getAllMessageContentFac`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getMessageContentFac(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getMessageContentFac/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteMessageContentFac(id: string) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteMessageContentFac/${id}`
    );
  }

  addMessageContentFac(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(this.supremeServiceApiUrl + `addMessageContentFac`, {
      dataEncrypt,
    });
  }

  editMessageContentFac(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editMessageContentFac/${id}`,
      {
        dataEncrypt,
      }
    );
  }

  getMessageContentModuleFac() {
    return this.http
      .get(this.supremeServiceApiUrl + `getMessageContentModuleFac`)
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
    return this.http.post(
      this.supremeServiceApiUrl + `addReferralPartnerStaff`,
      {
        dataEncrypt,
      }
    );
  }

  editReferralPartnerStaff(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editReferralPartnerStaff/${id}`,
      { dataEncrypt }
    );
  }

  getAllReferralPartnerStaff(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.supremeServiceApiUrl + `getAllReferralPartnerStaff`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  getReferralPartnerStaff(id: any) {
    return this.http
      .get(this.supremeServiceApiUrl + `getReferralPartnerStaff/${id}`)
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
      .get(this.supremeServiceApiUrl + `getStaffByReferralPartner`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteReferralPartnerStaff(id: any) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteReferralPartnerStaff/${id}`
    );
  }

  getAllFacilitatorName(data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.supremeServiceApiUrl + `getAllFacilitatorName`, { params })
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  addReferralPartnerZone(data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.post(
      this.supremeServiceApiUrl + `addReferralPartnerZone`,
      {
        dataEncrypt,
      }
    );
  }

  editReferralPartnerZone(id: any, data: any) {
    const dataEncrypt = this.sharedService.encrypt(data);
    return this.http.put(
      this.supremeServiceApiUrl + `editReferralPartnerZone/${id}`,
      { dataEncrypt }
    );
  }

  getAllReferralPartnerZone(id: string, data: any) {
    const params = new HttpParams()
      .set("page", data.page)
      .set("limit", data.limit)
      .set("search", data.search);
    return this.http
      .get(this.supremeServiceApiUrl + `getAllReferralPartnerZone/${id}`, {
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
      .get(this.supremeServiceApiUrl + `getReferralPartnerZone/${id}`)
      .pipe(
        map((res: any) => {
          res.data = this.sharedService.decrypt(res.data);
          return res;
        })
      );
  }

  deleteReferralPartnerZone(id: any) {
    return this.http.delete(
      this.supremeServiceApiUrl + `deleteReferralPartnerZone/${id}`
    );
  }

  //  referral partner Default Email

  getReferralPartnerDefaultEmail(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getReferralPartnerDefaultEmail/${id}`)
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
      this.supremeServiceApiUrl + `addReferralPartnerDefaultEmail`,
      {
        dataEncrypt,
      }
    );
  }

  //  referral partner Default Message

  getReferralPartnerDefaultMessage(id: string) {
    return this.http
      .get(this.supremeServiceApiUrl + `getReferralPartnerDefaultMessage/${id}`)
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
      this.supremeServiceApiUrl + `addReferralPartnerDefaultMessage`,
      {
        dataEncrypt,
      }
    );
  }
}
