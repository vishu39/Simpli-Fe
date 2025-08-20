import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { GET_LOGIN_TYPE, getUserType } from "src/app/shared/routing-constant";

@Component({
  selector: "app-add-email-fetch-setting",
  templateUrl: "./add-email-fetch-setting.component.html",
  styleUrls: ["./add-email-fetch-setting.component.scss"],
})
export class AddEmailFetchSettingComponent implements OnInit {
  dialogTitle: string;
  isEdit: boolean = false;
  emailFetchData: any = {};

  addEmailFetchSettingForm: FormGroup;

  userType = getUserType();

  constructor(
    private dialogRef: MatDialogRef<AddEmailFetchSettingComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.getAllInternalUser();
    this.createForm();

    if (this.isEdit) {
      this.onEdit();
    }
  }

  internalUserData: any = [];
  internalUserFreshData;
  isInternalUserLoading = true;
  isInternalUserdoSelectAll = false;
  getAllInternalUser(selectAll: Boolean = false) {
    this.isInternalUserLoading = true;
    this.hospitalService
      .getAllEmployeeUserForHopsital({ isEmailFetch: true })
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
      smtpEmailHost: data?.smtpEmailHost,
      oauth2: data?.oauth2,
      clientId: data?.clientId,
      clientSecret: data?.clientSecret,
      tenantId: data?.tenantId,
      copyEmail: data?.copyEmail,
      copyFolderName: data?.copyFolderName,
    });

    let clientIdControl = this.addEmailFetchSettingForm.get("clientId");
    let clientSecretControl = this.addEmailFetchSettingForm.get("clientSecret");
    let tenantIdControl = this.addEmailFetchSettingForm.get("tenantId");
    let copyFolderNameControl =
      this.addEmailFetchSettingForm.get("copyFolderName");

    if (data?.oauth2) {
      clientIdControl?.setValidators([Validators.required]);
      clientIdControl.updateValueAndValidity();

      clientSecretControl?.setValidators([Validators.required]);
      clientSecretControl.updateValueAndValidity();

      tenantIdControl?.setValidators([Validators.required]);
      tenantIdControl.updateValueAndValidity();
    }

    if (data?.copyEmail) {
      copyFolderNameControl?.setValidators([Validators.required]);
      copyFolderNameControl.updateValueAndValidity();
    }

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
      emailHost: ["", [Validators.required]],
      smtpEmailHost: ["", [Validators.required]],
      internalUser: [
        [],
        this.userType === "admin" ? [] : [Validators.required],
      ],
      oauth2: [false],
      clientId: [""],
      clientSecret: [""],
      tenantId: [""],
      copyEmail: [false],
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
        this.hospitalService
          .addEmailFetchSetting(values)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.hospitalService
          .editEmailFetchSetting(values, this.emailFetchData?._id)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
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

  onToggleModeChangeCopyEmail(e: any) {
    let checked = e?.checked;
    let copyFolderNameControl =
      this.addEmailFetchSettingForm.get("copyFolderName");

    if (checked) {
      copyFolderNameControl?.setValidators([Validators.required]);
      copyFolderNameControl.updateValueAndValidity();
    } else {
      copyFolderNameControl.clearValidators();
      copyFolderNameControl.updateValueAndValidity();
    }
  }

  onToggleModeChange(e: any) {
    let checked = e?.checked;
    let clientIdControl = this.addEmailFetchSettingForm.get("clientId");
    let clientSecretControl = this.addEmailFetchSettingForm.get("clientSecret");
    let tenantIdControl = this.addEmailFetchSettingForm.get("tenantId");

    if (checked) {
      clientIdControl?.setValidators([Validators.required]);
      clientIdControl.updateValueAndValidity();

      clientSecretControl?.setValidators([Validators.required]);
      clientSecretControl.updateValueAndValidity();

      tenantIdControl?.setValidators([Validators.required]);
      tenantIdControl.updateValueAndValidity();
    } else {
      // this.addEmailFetchSettingForm.patchValue({
      //   clientId: "",
      //   clientSecret: "",
      //   tenantId: "",
      // })

      clientIdControl.clearValidators();
      clientIdControl.updateValueAndValidity();

      clientSecretControl.clearValidators();
      clientSecretControl.updateValueAndValidity();

      tenantIdControl.clearValidators();
      tenantIdControl.updateValueAndValidity();
    }
  }
}
