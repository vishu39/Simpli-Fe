import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-shared-email-communication-default-email",
  templateUrl: "./default-email.component.html",
  styleUrls: ["./default-email.component.scss"],
})
export class DefaultEmailComponent implements OnInit {
  internalUserData: any = [];
  selectedQueryViewData: any;
  onSelectNav: boolean = false;
  internalUserId: string;
  navIndex: number = 0;
  zoneButtomStatus = false;

  @ViewChild("selectAllCheckbox") selectAllCheckbox: ElementRef;

  constructor(
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.sharedService.emailCommunicationChangedSubjectForHospital.subscribe(
      (res: any) => {
        let location = window.location.href;
        if (
          res?.isChanged &&
          location?.includes("/email-communication/default-email")
        ) {
          this.getAllInternalUser();
        } else if (
          !res?.isChanged &&
          location?.includes("/email-communication/default-email")
        ) {
          this.getAllInternalUser();
        }
      }
    );
  }

  emailSettingByUserData: any = [];
  isEmailSettingByUserLoading = false;

  emailCommunicationDefaultEmailData: any = [];
  isEmailCommunicationDefaultEmailLoading = false;

  getAllEmailSettingByUser(id: any) {
    this.isEmailSettingByUserLoading = true;
    this.hospitalService.getAllEmailSettingByUser(id).subscribe(
      (res: any) => {
        this.emailSettingByUserData = res?.data;
        if (this.emailSettingByUserData?.length) {
          this.emailSettingByUserData.map((obj: any) => {
            obj.isDefault = false;
          });
        }
        this.getEmailCommunicationDefaultEmail(
          this.internalUserData[this.navIndex]._id
        );
        this.isEmailSettingByUserLoading = false;
      },
      (err) => {
        this.isEmailSettingByUserLoading = false;
      }
    );
  }

  onToggleChange(event: any, index: any) {
    let { checked } = event;
    if (checked) {
      this.emailSettingByUserData?.map((obj: any) => {
        obj.isDefault = false;
      });
      this.emailSettingByUserData[index].isDefault = true;
    } else {
      this.emailSettingByUserData[index].isDefault = false;
    }
  }

  getEmailCommunicationDefaultEmail(id: any) {
    this.hospitalService.getEmailCommunicationDefaultEmail(id).subscribe(
      (res: any) => {
        this.emailCommunicationDefaultEmailData = res?.data;
        if (!!this.emailCommunicationDefaultEmailData?._id) {
          this.selectDefaultCommunicationEmail();
        }
      },
      (err) => {}
    );
  }

  selectDefaultCommunicationEmail() {
    let defaultEmailIndex = this.emailSettingByUserData?.findIndex(
      (item: any) =>
        item?._id === this.emailCommunicationDefaultEmailData?.defaultEmail
    );

    if (defaultEmailIndex !== -1) {
      this.emailSettingByUserData[defaultEmailIndex].isDefault = true;
    }
  }

  isInternalUserLoading = true;
  getAllInternalUser() {
    this.isInternalUserLoading = true;
    this.isAdminLoading = true;
    this.hospitalService
      .getAllEmployeeUserHopsital({ isEmailSettingDefault: true })
      .subscribe(
        (res: any) => {
          this.internalUserData = res.data || [];
          this.getAdminDetails();
          this.isInternalUserLoading = false;
        },
        (err) => {
          this.isInternalUserLoading = false;
          this.isAdminLoading = false;
        }
      );
  }

  copyInternalUserData: any = [];
  isAdminLoading = false;
  getAdminDetails() {
    this.isAdminLoading = true;
    this.sharedService.getAdminDetails().subscribe(
      (res: any) => {
        this.internalUserData.unshift(res.data);
        if (this.internalUserData?.length) {
          this.internalUserData.map((obj) => {
            obj.active = false;
          });
          this.internalUserData[this.navIndex].active = true;
          this.internalUserId = this.internalUserData[this.navIndex]._id;
          this.isAdminLoading = false;
          this.getAllEmailSettingByUser(
            this.internalUserData[this.navIndex]._id
          );
        } else {
          this.isAdminLoading = false;
        }
        this.copyInternalUserData = cloneDeep(this.internalUserData);
      },
      () => {
        this.isAdminLoading = false;
      }
    );
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
          this.getAllEmailSettingByUser(filterArray?.[this.navIndex]._id);
        } else {
          filterArray = [];
          this.emailSettingByUserData = [];
          this.emailCommunicationDefaultEmailData = null;
        }
        this.internalUserData = filterArray;
      } else {
        this.internalUserData = this.copyInternalUserData;
        this.navIndex = 0;
        this.internalUserData[this.navIndex].active = true;
        this.internalUserId = this.internalUserData[this.navIndex]._id;
        this.getAllEmailSettingByUser(
          this.internalUserData?.[this.navIndex]._id
        );
      }
    }, 600);
  }

  onActive(obj, i) {
    this.navIndex = i;
    this.internalUserData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.internalUserId = obj._id;
    this.getAllEmailSettingByUser(obj._id);
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

  submit() {
    let payload = {
      user: this.internalUserId,
    };
    let findDefaultIndex = this.emailSettingByUserData?.findIndex(
      (esd: any) => esd?.isDefault
    );

    if (findDefaultIndex !== -1) {
      payload["defaultEmail"] =
        this.emailSettingByUserData[findDefaultIndex]?._id;
    } else {
      payload["defaultEmail"] = null;
    }

    if (!!this.emailCommunicationDefaultEmailData?._id) {
      // edit
      this.hospitalService
        .editEmailCommunicationDefaultEmail(
          payload,
          this.emailCommunicationDefaultEmailData?._id
        )
        .subscribe((res: any) => {
          // this.getAllEmailSettingByUser(
          //   this.internalUserData[this.navIndex]._id
          // );
          this.sharedService.emailCommunicationChangedSubjectForHospital.next({
            isChanged: true,
          });
          this.sharedService.showNotification("snackBar-success", res?.message);
        });
    } else {
      // add
      this.hospitalService
        .addEmailCommunicationDefaultEmail(payload)
        .subscribe((res: any) => {
          // this.getAllEmailSettingByUser(
          //   this.internalUserData[this.navIndex]._id
          // );
          this.sharedService.emailCommunicationChangedSubjectForHospital.next({
            isChanged: true,
          });
          this.sharedService.showNotification("snackBar-success", res?.message);
        });
    }
  }
}
