import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import {cloneDeep} from 'lodash'

@Component({
  selector: "app-add-user-permission",
  templateUrl: "./add-user-permission.component.html",
  styleUrls: ["./add-user-permission.component.scss"],
})
export class AddUserPermissionComponent implements OnInit {
  userPermisison: any;
  userPermissionForm: FormGroup;
  objectKeys = Object.keys;

  constructor(
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<AddUserPermissionComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.getUserPermission();
    this.getUserPermissionRole();
  }

  buildForm() {
    this.userPermissionForm = this.formBuilder.group({
      roleName: ["", [Validators.required]],
      selectRole: [""],
    });
  }

  isUserPermissionsLoading = false;
  userPermission: any = [];
  freshUserPermission: any = [];
  selectedRole: any;
  getUserPermissionRole() {
    this.isUserPermissionsLoading = true;
    this.hospitalService.getAllPermissionDB().subscribe(
      (res: any) => {
        if (res?.data?.length) {
          this.userPermission = res?.data;
          this.freshUserPermission = res?.data;
        } else {
          this.userPermission = [];
          this.selectedRole = null;
          this.userPermissionForm.reset();
        }
        this.isUserPermissionsLoading = false;
      },
      (err) => {
        this.isUserPermissionsLoading = false;
      }
    );
  }

  selectedPreviousRole: any = {};
  isPreviousRoleSelected: any = false;
  onClickSelectRole(item: any) {
    this.isPreviousRoleSelected = true;
    this.selectedPreviousRole = item;
  }

  getUserPermission() {
    this.hospitalService.getAllPermission().subscribe((res: any) => {
      this.userPermisison = res.data;
      this.freshUserPermission = res.data;
      // console.log('this.userPermisison', this.userPermisison)
    });
  }
  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  timeoutRole=null
    searchRole(filterValue: string) {
      clearTimeout(this.timeoutRole);
      this.timeoutRole = setTimeout(() => {
        if (!!filterValue) {
          let filterArray = cloneDeep(this.freshUserPermission);
          this.userPermission = [];
          let filterData = filterArray.filter((f: any) =>
            f?.roleName?.toLowerCase().includes(filterValue?.toLowerCase().trim())
          );
          if (filterData.length) {
            filterArray = filterData;
          } else {
            filterArray = [];
          }
          this.userPermission = filterArray;
        } else {
          this.userPermission = this.freshUserPermission;
        }
      }, 600);
    }

  formSubmit() {
    if (this.userPermissionForm.valid) {
      const data = {
        roleName: this.userPermissionForm.value.roleName,
        modules: this.isPreviousRoleSelected
          ? [...this.selectedPreviousRole?.modules]
          : [...this.userPermisison],
      };

      this.hospitalService.addUserRolePermission(data).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeDialog(true);
      });
    } else {
      Object.keys(this.userPermissionForm.controls).forEach((key) => {
        this.userPermissionForm.controls[key].markAsTouched();
      });
    }
  }
}
