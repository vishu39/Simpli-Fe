import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-shared-email-sent-setting",
  templateUrl: "./email-sent-setting.component.html",
  styleUrls: ["./email-sent-setting.component.scss"],
})
export class EmailSentSettingComponent implements OnInit {
  internalUserData: any = [];
  selectedQueryViewData: any;
  onSelectNav: boolean = false;
  internalUserId: string;
  navIndex: number = 0;
  zoneButtomStatus = false;

  @ViewChild("selectAllCheckbox") selectAllCheckbox: ElementRef;

  toggleNames = {
    patient: "Addition of Patient",
    opinionRequest: "Opinion Request",
  };

  constructor(
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.getAllInternalUser();
  }

  isInternalUserLoading = true;
  getAllInternalUser() {
    this.isInternalUserLoading = true;
    this.hospitalService
      .getAllEmployeeUserHopsital({ isQueryViewSetting: true })
      .subscribe(
        (res: any) => {
          this.internalUserData = res.data;
          this.getAdminDetails();
          this.isInternalUserLoading = false;
        },
        (err) => {
          this.isInternalUserLoading = false;
        }
      );
  }

  copyInternalUserData: any = [];
  getAdminDetails() {
    this.sharedService.getAdminDetails().subscribe((res: any) => {
      this.internalUserData.unshift(res.data);
      if (this.internalUserData.length) {
        this.internalUserData.map((obj) => {
          obj.active = false;
        });
        this.internalUserData[this.navIndex].active = true;
        this.internalUserId = this.internalUserData[this.navIndex]._id;
        this.getEmailSendSetting(this.internalUserData[this.navIndex]._id);
      } else {
        this.isEmailSendDataLoading = false;
      }
      this.copyInternalUserData = cloneDeep(this.internalUserData);
    });
  }

  timeoutInternalUser = null;
  searchInternalUser(filterValue: string) {
    clearTimeout(this.timeoutInternalUser);
    this.timeoutInternalUser = setTimeout(() => {
      if (!!filterValue) {
        this.internalUserData.map((obj) => {
          obj.active = false;
        });
        let filterArray = cloneDeep(this.internalUserData);
        this.internalUserData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
          this.navIndex = 0;
          filterArray[this.navIndex].active = true;
          this.internalUserId = filterArray[this.navIndex]._id;
          this.getEmailSendSetting(filterArray?.[this.navIndex]._id);
        } else {
          filterArray = [];
          this.emailSendData = [];
          this.emailContentModuleData = [];
          this.modules = [];
          this.internalUserId = "";
          this.isEmailSendDataAvailable = false;
        }
        this.internalUserData = filterArray;
      } else {
        this.internalUserData = this.copyInternalUserData;
        this.navIndex = 0;
        this.internalUserData[this.navIndex].active = true;
        this.internalUserId = this.internalUserData[this.navIndex]._id;
        this.getEmailSendSetting(this.internalUserData?.[this.navIndex]._id);
      }
    }, 600);
  }

  isSettingLoading = false;
  isEmailSendDataAvailable: boolean = true;
  emailSendData: any = [];
  isEmailSendDataLoading = true;
  getEmailSendSetting(id: any) {
    this.isEmailSendDataLoading = true;
    this.zoneButtomStatus = true;
    this.hospitalService.getEmailSendSetting(id).subscribe(
      (res: any) => {
        this.onSelectNav = true;
        this.zoneButtomStatus = false;
        this.selectedQueryViewData = res.data;
        if (res?.data) {
          this.isEmailSendDataAvailable = true;
          this.emailSendData = res?.data;
          this.isEmailSendDataLoading = false;
        } else {
          this.isEmailSendDataAvailable = false;
          this.getEmailContentModule();
        }
      },
      (err) => {
        this.isEmailSendDataLoading = false;
      }
    );
  }
  onActive(obj, i) {
    this.navIndex = i;
    this.internalUserData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.internalUserId = obj._id;
    this.emailContentModuleData = [];
    this.emailSendData = [];
    this.isEmailSendDataAvailable = true;
    this.getEmailSendSetting(obj._id);
  }

  emailContentModuleData = [];
  isContentLoading = false;
  getEmailContentModule() {
    this.isContentLoading = true;
    this.hospitalService.getEmailContentModule().subscribe(
      (res) => {
        this.emailContentModuleData = cloneDeep(res?.data);
        if (this.emailContentModuleData?.length) {
          this.emailContentModuleData?.forEach((d: any) => {
            d["permission"] = false;
          });
          this.isContentLoading = false;
          this.isEmailSendDataLoading = false;
        }
      },
      (err) => {
        this.isContentLoading = false;
      }
    );
  }

  onClickSelectAll(e: any, data: any) {
    if (e.checked) {
      data?.forEach((d: any) => {
        d["permission"] = true;
      });
    } else {
      data?.forEach((d: any) => {
        d["permission"] = false;
      });
    }
  }

  modules: any = [];
  submit() {
    this.modules = [];

    if (!this.isEmailSendDataAvailable) {
      let data = cloneDeep(this.emailContentModuleData);
      data.forEach((d: any) => {
        let obj = {
          moduleName: d?.name,
          permission: d?.permission,
        };
        this.modules.push(obj);
      });
    } else {
      this.modules = this.emailSendData?.modules;
    }

    const payload = {
      user: this.internalUserId,
      modules: this.modules,
    };

    if (this.isEmailSendDataAvailable) {
      // edit
      this.hospitalService
        .editEmailSendSetting(this.emailSendData?._id, payload)
        .subscribe((res: any) => {
          this.getEmailSendSetting(this.internalUserData[this.navIndex]._id);
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.emailSendData = [];
          this.emailContentModuleData = [];
          this.modules = [];
        });
    } else {
      // add
      this.hospitalService
        .addEmailSendSetting(payload)
        .subscribe((res: any) => {
          this.getEmailSendSetting(this.internalUserData[this.navIndex]._id);
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.emailSendData = [];
          this.emailContentModuleData = [];
          this.modules = [];
        });
    }
    if (this.selectAllCheckbox["checked"]) {
      this.selectAllCheckbox["checked"] = false;
    }
  }
}
