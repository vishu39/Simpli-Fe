import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { getUserType } from "src/app/shared/routing-constant";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-add-email-host-for-communication",
  templateUrl: "./add-email-host-for-communication.component.html",
  styleUrls: ["./add-email-host-for-communication.component.scss"],
})
export class AddEmailHostForCommunicationComponent implements OnInit {
  dialogTitle: string;
  isEdit: boolean = false;
  emailFetchData: any = {};

  addEmailFetchSettingForm: FormGroup;

  userType = getUserType();

  constructor(
    private dialogRef: MatDialogRef<AddEmailHostForCommunicationComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.getAllInternalUser();
    this.getEmailSettingType();
    this.createForm();

    if (this.isEdit) {
      this.onEdit();
    }
  }

  // type linking
  emailSettingTypeData: any = [];
  emailSettingTypeFreshData;
  isEmailSettingTypeLoading = true;
  isEmailSettingTypeSelectAll = false;
  selectedTypeSearch: any = [];

  getEmailSettingType(selectAll: Boolean = false) {
    this.isEmailSettingTypeLoading = true;
    let data = this.emailFetchData;
    this.sharedService.getEmailSettingType().subscribe(
      (res: any) => {
        this.emailSettingTypeData = res?.data;
        this.emailSettingTypeFreshData = res?.data;
        if (!data?.type) {
          // this.selectedTypeSearch = [this.emailSettingTypeData[0]];
          this.addEmailFetchSettingForm.patchValue({
            type: this.emailSettingTypeData[0],
          });
        }
        this.isEmailSettingTypeLoading = false;

        // if (selectAll) {
        //   const allEmailSettingType = this.emailSettingTypeData.map(
        //     (item) => item
        //   );
        //   allEmailSettingType.forEach((iu: any) => {
        //     const isEmailSettingTypeAlreadySelected =
        //       this.selectedTypeSearch.some(
        //         (selectedType: any) => selectedType === iu
        //       );
        //     if (!isEmailSettingTypeAlreadySelected) {
        //       this.selectedTypeSearch.push(iu);
        //     }
        //   });
        //   this.addEmailFetchSettingForm.patchValue({
        //     type: this.selectedTypeSearch,
        //   });

        //   this.isEmailSettingTypeSelectAll = false;
        // }
      },
      (err) => {
        this.isEmailSettingTypeLoading = false;
      }
    );
  }

  // compareObjectsForType(item1, item2) {
  //   return item1 === item2;
  // }

  // onTypeClick(item: any) {
  //   const index = this.selectedTypeSearch.findIndex(
  //     (element) => element === item
  //   );

  //   if (index !== -1) {
  //     this.selectedTypeSearch.splice(index, 1);
  //   } else {
  //     this.selectedTypeSearch.push(item);
  //   }
  //   this.addEmailFetchSettingForm.patchValue({
  //     type: [...new Set(this.selectedTypeSearch)],
  //   });
  // }

  // selectAllType(event: any) {
  //   if (event.checked) {
  //     this.isEmailSettingTypeSelectAll = true;
  //     this.selectedTypeSearch = [];
  //     this.getEmailSettingType(true);
  //   } else {
  //     this.selectedTypeSearch = [];
  //     this.addEmailFetchSettingForm.patchValue({
  //       type: [],
  //     });
  //   }
  // }

  // timeoutType = null;
  // searchEmailSettingType(filterValue: string) {
  //   clearTimeout(this.timeoutType);
  //   this.timeoutType = setTimeout(() => {
  //     if (!!filterValue) {
  //       let filterArray = cloneDeep(this.emailSettingTypeFreshData);
  //       this.emailSettingTypeData = [];
  //       let filterData = filterArray.filter((f: any) =>
  //         f?.toLowerCase().includes(filterValue?.toLowerCase().trim())
  //       );
  //       if (filterData.length) {
  //         filterArray = filterData;
  //       } else {
  //         filterArray = [];
  //       }
  //       this.emailSettingTypeData = filterArray;
  //     } else {
  //       this.emailSettingTypeData = this.emailSettingTypeFreshData;
  //     }
  //   }, 600);
  // }

  // internal user linking
  internalUserData: any = [];
  internalUserFreshData;
  isInternalUserLoading = true;
  isInternalUserdoSelectAll = false;
  getAllInternalUser(selectAll: Boolean = false) {
    this.isInternalUserLoading = true;
    this.hospitalService
      .getAllEmployeeUserForHopsital({ isEmailSetting: true })
      .subscribe(
        (res: any) => {
          this.internalUserData = res.data;
          this.internalUserFreshData = res.data;
          this.isInternalUserLoading = false;

          // if (selectAll) {
          //   const allInternalUser = this.internalUserData.map((item) => ({
          //     _id: item._id,
          //     name: item.name,
          //   }));
          //   allInternalUser.forEach((iu: any) => {
          //     const isInternalUserAlreadySelected =
          //       this.selectedInternalUserSearch.some(
          //         (selectedInternalUser: any) =>
          //           selectedInternalUser?._id === iu?._id
          //       );
          //     if (!isInternalUserAlreadySelected) {
          //       this.selectedInternalUserSearch.push(iu);
          //     }
          //   });
          //   this.addEmailFetchSettingForm.patchValue({
          //     internalUser: this.selectedInternalUserSearch,
          //   });
          //   this.isInternalUserdoSelectAll = false;
          // }
        },
        (err) => {
          this.isInternalUserLoading = false;
        }
      );
  }

  timeoutPartner = null;
  searchInternalUser(filterValue: string) {
    clearTimeout(this.timeoutPartner);
    this.timeoutPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.internalUserFreshData);
        this.internalUserData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.internalUserData = filterArray;
      } else {
        this.internalUserData = this.internalUserFreshData;
      }
    }, 600);
  }

  selectedInternalUserSearch: any = [];
  onClickInternalUser(item: any) {
    const index = this.selectedInternalUserSearch.findIndex(
      (element) => element?._id === item?._id
    );

    if (index !== -1) {
      this.selectedInternalUserSearch.splice(index, 1);
    } else {
      this.selectedInternalUserSearch.push(item);
    }
    this.addEmailFetchSettingForm.patchValue({
      internalUser: [...new Set(this.selectedInternalUserSearch)],
    });
  }

  selectAllInternalUser(event: any) {
    if (event.checked) {
      // this.isInternalUserdoSelectAll = true;
      this.selectedInternalUserSearch = [];
      // this.getAllInternalUser(true);

      const allInternalUser = this.internalUserData.map((item) => ({
        _id: item._id,
        name: item.name,
      }));

      allInternalUser.forEach((iu: any) => {
        const isInternalUserAlreadySelected =
          this.selectedInternalUserSearch.some(
            (selectedInternalUser: any) => selectedInternalUser?._id === iu?._id
          );

        if (!isInternalUserAlreadySelected) {
          this.selectedInternalUserSearch.push(iu);
        }
      });
      this.addEmailFetchSettingForm.patchValue({
        internalUser: this.selectedInternalUserSearch,
      });
    } else {
      this.selectedInternalUserSearch = [];
      this.addEmailFetchSettingForm.patchValue({
        internalUser: [],
      });
    }
  }

  returnNameFromId(item: any) {
    let obj = this.internalUserData?.find((iud: any) => iud?._id === item?._id);
    return `${obj?.name} - ${obj?.userType}`;
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  onEdit() {
    let data = this.emailFetchData;
    this.addEmailFetchSettingForm.patchValue({
      emailId: data?.emailId,
      password: data?.password,
      emailHost: data?.emailHost,
      type: data?.type,
      copyEmail: data?.copyEmail,
      imapEmailHost: data?.imapEmailHost,
      copyFolderName: data?.copyFolderName,
    });

    let imapEmailHostControl =
      this.addEmailFetchSettingForm.get("imapEmailHost");
    let copyFolderNameControl =
      this.addEmailFetchSettingForm.get("copyFolderName");

    if (data?.copyEmail) {
      imapEmailHostControl?.setValidators([Validators.required]);
      imapEmailHostControl.updateValueAndValidity();

      copyFolderNameControl?.setValidators([Validators.required]);
      copyFolderNameControl.updateValueAndValidity();
    }

    // if (data?.type?.length > 0) {
    //   this.selectedTypeSearch = data?.type;
    //   this.addEmailFetchSettingForm.patchValue({
    //     type: this.selectedTypeSearch,
    //   });
    // }

    let newInternalUserArray = [];
    data?.internalUser?.forEach((d: any) => {
      let obj = {
        _id: d._id,
        name: d.name,
      };
      newInternalUserArray.push(obj);
    });

    this.selectedInternalUserSearch = newInternalUserArray;
    this.addEmailFetchSettingForm.patchValue({
      internalUser: [...new Set(this.selectedInternalUserSearch)],
    });
  }

  onToggleModeChange(e: any) {
    let checked = e?.checked;
    let imapEmailHostControl =
      this.addEmailFetchSettingForm.get("imapEmailHost");
    let copyFolderNameControl =
      this.addEmailFetchSettingForm.get("copyFolderName");

    if (checked) {
      imapEmailHostControl?.setValidators([Validators.required]);
      imapEmailHostControl.updateValueAndValidity();

      copyFolderNameControl?.setValidators([Validators.required]);
      copyFolderNameControl.updateValueAndValidity();
    } else {
      imapEmailHostControl.clearValidators();
      imapEmailHostControl.updateValueAndValidity();

      copyFolderNameControl.clearValidators();
      copyFolderNameControl.updateValueAndValidity();
    }
  }

  createForm() {
    this.addEmailFetchSettingForm = this.formBuilder.group({
      emailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      password: ["", [Validators.required]],
      type: ["", [Validators.required]],
      emailHost: ["", [Validators.required]],
      internalUser: [
        [],
        this.userType === "admin" ? [] : [Validators.required],
      ],
      copyEmail: [false],
      imapEmailHost: [""],
      copyFolderName: [""],
    });
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  submit() {
    if (this.addEmailFetchSettingForm.valid) {
      let values = this.addEmailFetchSettingForm?.getRawValue();
      let internalUserArray = cloneDeep(values["internalUser"]);

      let newArray = [];
      internalUserArray?.forEach((iua: any) => {
        newArray.push(iua?._id);
      });

      values["internalUser"] = newArray;

      if (!this.isEdit) {
        this.hospitalService.addEmailSetting(values).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.sharedService.emailCommunicationChangedSubjectForHospital.next({
            isChanged: true,
          });
          this.closeDialog(true);
        });
      } else {
        this.hospitalService
          .editEmailSetting(values, this.emailFetchData?._id)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.sharedService.emailCommunicationChangedSubjectForHospital.next(
              {
                isChanged: true,
              }
            );
            this.closeDialog(true);
          });
      }
    } else {
      this.addEmailFetchSettingForm.markAllAsTouched();
    }
  }

  internalUserIncludes(item: any) {
    let index = this.internalUserData?.findIndex(
      (iud: any) => iud?._id === item?._id
    );

    if (index >= 0) {
      return true;
    } else {
      false;
    }
  }
}
