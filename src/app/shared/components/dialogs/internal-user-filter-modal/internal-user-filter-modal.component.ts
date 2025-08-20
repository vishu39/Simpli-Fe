import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";
import { cloneDeep } from "lodash";
import { userType } from "src/app/core/constant";

@Component({
  selector: "app-internal-user-filter-modal",
  templateUrl: "./internal-user-filter-modal.component.html",
  styleUrls: ["./internal-user-filter-modal.component.scss"],
})
export class InternalUserFilterModalComponent implements OnInit {
  dialogTitle: string;
  internalUserModalForm: FormGroup;
  selectedFilters: any;
  loginType = GET_LOGIN_TYPE();

  constructor(
    public dialogRef: MatDialogRef<InternalUserFilterModalComponent>,
    private facilitatorService: FacilitatorService,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.loginType === "hospital") {
      this.getAllRoleForHospital();
      this.getHospitalAdminUserType();
    }
    if (this.loginType === "facilitator") {
      this.getAllRoleForFacilitator();
      this.getFacilitatorAdminUserType();
    }

    if (
      this.selectedFilters?.role?.length > 0 ||
      this.selectedFilters?.userType?.length > 0
    ) {
      this.selectedRole = this.selectedFilters?.role || [];
      this.selectedUserType = this.selectedFilters?.userType || [];

      this.internalUserModalForm.patchValue({
        role: this.selectedRole,
        userType: this.selectedUserType,
      });
    }
  }

  createForm() {
    this.internalUserModalForm = this.fb.group({
      role: [[]],
      userType: [[]],
    });
  }

  // userType linking

  userTypeData: any;
  freshUserTypeData: any;
  userTypeLoading = false;
  selectedUserType = [];
  timeoutUserType = null;
  getHospitalAdminUserType() {
    this.userTypeLoading = true;
    this.sharedService.getHospitalAdminUserType().subscribe((res: any) => {
      this.userTypeData = res.data;
      this.freshUserTypeData = res.data;
      this.userTypeLoading = false;
    });
  }

  getFacilitatorAdminUserType() {
    this.userTypeLoading = true;
    this.sharedService.getFacilitatorAdminUserType().subscribe((res: any) => {
      this.userTypeData = res.data;
      this.freshUserTypeData = res.data;
      this.userTypeLoading = false;
    });
  }

  onTypeChange(item: any) {
    const index = this.selectedUserType.findIndex(
      (element) => element === item
    );
    if (index !== -1) {
      this.selectedUserType.splice(index, 1);
    } else {
      this.selectedUserType.push(item);
    }
    this.internalUserModalForm.patchValue({
      userType: [...new Set(this.selectedUserType)],
    });
  }

  searchUserType(filterValue: string) {
    clearTimeout(this.timeoutUserType);
    this.timeoutUserType = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshUserTypeData);
        this.userTypeData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.userTypeData = filterArray;
      } else {
        this.userTypeData = this.freshUserTypeData;
      }
    }, 600);
  }

  selectAllUserType(event: any) {
    if (event.checked) {
      this.selectedUserType = [];

      const allUserType = this.userTypeData?.map((item) => item);

      allUserType.forEach((iu: any) => {
        const isTypeSelected = this.selectedUserType.some(
          (selectedUserType: any) => selectedUserType === iu
        );

        if (!isTypeSelected) {
          this.selectedUserType.push(iu);
        }
      });
      this.internalUserModalForm.patchValue({
        userType: this.selectedUserType,
      });
    } else {
      this.selectedUserType = [];
      this.internalUserModalForm.patchValue({
        userType: [],
      });
    }
  }

  compareObjectsUserType(item1, item2) {
    return item1 === item2;
  }

  // role linking
  roleData: any;
  freshRoleData: any;
  roleLoading = false;
  selectedRole = [];
  timeoutRole = null;
  getAllRoleForHospital() {
    this.roleLoading = true;
    this.hospitalService.getAllRole().subscribe((res: any) => {
      this.roleData = res.data;
      this.freshRoleData = res.data;
      this.roleLoading = false;
    });
  }

  getAllRoleForFacilitator() {
    this.roleLoading = true;
    this.facilitatorService.getAllRole().subscribe((res: any) => {
      this.roleData = res.data;
      this.freshRoleData = res.data;
      this.roleLoading = false;
    });
  }

  onRoleChange(item: any) {
    const index = this.selectedRole.findIndex(
      (element) => element._id === item?._id
    );
    if (index !== -1) {
      this.selectedRole.splice(index, 1);
    } else {
      this.selectedRole.push(item);
    }
    this.internalUserModalForm.patchValue({
      role: [...new Set(this.selectedRole)],
    });
  }

  searchRole(filterValue: string) {
    clearTimeout(this.timeoutRole);
    this.timeoutRole = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshRoleData);
        this.roleData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.roleName?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.roleData = filterArray;
      } else {
        this.roleData = this.freshRoleData;
      }
    }, 600);
  }

  selectAllRole(event: any) {
    if (event.checked) {
      this.selectedRole = [];

      const allRole = this.roleData.map((item) => item);

      allRole.forEach((iu: any) => {
        const isRoleSelected = this.selectedRole.some(
          (selectedRole: any) => selectedRole === iu
        );

        if (!isRoleSelected) {
          this.selectedRole.push(iu);
        }
      });
      this.internalUserModalForm.patchValue({
        role: this.selectedRole,
      });
    } else {
      this.selectedRole = [];
      this.internalUserModalForm.patchValue({
        role: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id;
  }

  closeDialog(apiCall: boolean, type = "close"): void {
    let filterData = this.internalUserModalForm.value;
    this.dialogRef.close({ apiCall, filterData, type });
  }

  submit() {
    this.closeDialog(true, "submit");
  }

  resetFilter() {
    this.selectedRole = [];
    this.selectedUserType = [];
    this.internalUserModalForm.reset({
      role: [],
      userType: [],
    });
    this.closeDialog(true, "reset");
  }
}
