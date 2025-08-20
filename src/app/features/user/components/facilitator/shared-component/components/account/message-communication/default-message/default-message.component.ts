import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SubjectService } from "src/app/core/service/subject/subject.service";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "shared-default-message-fac",
  templateUrl: "./default-message.component.html",
  styleUrls: ["./default-message.component.scss"],
})
export class DefaultMessageComponent implements OnInit {
  internalUserData: any = [];
  selectedQueryViewData: any;
  onSelectNav: boolean = false;
  internalUserId: string;
  navIndex: number = 0;
  zoneButtomStatus = false;

  @ViewChild("selectAllCheckbox") selectAllCheckbox: ElementRef;

  constructor(
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.subjectService.messageCommunicationChangedSubjectForFacilitator.subscribe(
      (res: any) => {
        let location = window.location.href;
        if (
          res?.isChanged &&
          location?.includes("/message-communication/default-message")
        ) {
          this.getAllInternalUser();
        } else if (
          !res?.isChanged &&
          location?.includes("/message-communication/default-message")
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

  getAllMessageSettingByUser(id: any) {
    this.isEmailSettingByUserLoading = true;
    this.facilitatorService.getAllMessageSettingByUser(id).subscribe(
      (res: any) => {
        this.emailSettingByUserData = res?.data;
        if (this.emailSettingByUserData?.length) {
          this.emailSettingByUserData.map((obj: any) => {
            obj.isDefault = false;
          });
        }
        this.getMessageCommunicationDefaultMessage(
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

  getMessageCommunicationDefaultMessage(id: any) {
    this.facilitatorService.getMessageCommunicationDefaultMessage(id).subscribe(
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
        item?._id === this.emailCommunicationDefaultEmailData?.defaultMessage
    );

    if (defaultEmailIndex !== -1) {
      this.emailSettingByUserData[defaultEmailIndex].isDefault = true;
    }
  }

  isInternalUserLoading = true;
  getAllInternalUser() {
    this.isInternalUserLoading = true;
    this.isAdminLoading = true;
    this.facilitatorService
      .getAllEmployeeUserFacilitator({ isEmailSettingDefault: true })
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
          this.getAllMessageSettingByUser(
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
          this.getAllMessageSettingByUser(filterArray?.[this.navIndex]._id);
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
        this.getAllMessageSettingByUser(
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
    this.getAllMessageSettingByUser(obj._id);
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
      payload["defaultMessage"] =
        this.emailSettingByUserData[findDefaultIndex]?._id;
    } else {
      payload["defaultMessage"] = null;
    }

    if (!!this.emailCommunicationDefaultEmailData?._id) {
      // edit
      this.facilitatorService
        .editMessageCommunicationDefaultMessage(
          payload,
          this.emailCommunicationDefaultEmailData?._id
        )
        .subscribe((res: any) => {
          // this.getAllMessageSettingByUser(
          //   this.internalUserData[this.navIndex]._id
          // );
          this.subjectService.messageCommunicationChangedSubjectForFacilitator.next(
            {
              isChanged: true,
            }
          );
          this.sharedService.showNotification("snackBar-success", res?.message);
        });
    } else {
      // add
      this.facilitatorService
        .addMessageCommunicationDefaultMessage(payload)
        .subscribe((res: any) => {
          // this.getAllMessageSettingByUser(
          //   this.internalUserData[this.navIndex]._id
          // );
          this.subjectService.messageCommunicationChangedSubjectForFacilitator.next(
            {
              isChanged: true,
            }
          );
          this.sharedService.showNotification("snackBar-success", res?.message);
        });
    }
  }
}
