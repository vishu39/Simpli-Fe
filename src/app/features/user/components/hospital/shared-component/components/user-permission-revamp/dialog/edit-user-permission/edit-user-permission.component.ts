import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import {cloneDeep} from 'lodash'

@Component({
  selector: "app-edit-user-permission",
  templateUrl: "./edit-user-permission.component.html",
  styleUrls: ["./edit-user-permission.component.scss"],
})
export class EditUserPermissionComponent implements OnInit {
  constructor(
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<EditUserPermissionComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getUserPermissionRole();
  }

  userPermissionForm: FormGroup;
  buildForm() {
    this.userPermissionForm = this.formBuilder.group({
      selectRole: ["", [Validators.required]],
      roleName: ["", [Validators.required]],
    });
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  selectedRoleForEdit: any = {};
  isRoleSelected: any = false;
  onClickRole(item: any) {
    this.isRoleSelected = true;
    this.selectedRoleForEdit = item;
    this.userPermissionForm.patchValue({
      roleName: this.selectedRoleForEdit?.roleName,
    });
  }

  isUserPermissionsLoading = false;
  userPermission: any = [];
  selectedRole: any;
  freshUserPermission: any = [];
  getUserPermissionRole() {
    this.isUserPermissionsLoading = true;
    this.hospitalService.getAllPermissionDB().subscribe(
      (res: any) => {
        if (res?.data?.length) {
          this.userPermission = res?.data;
          this.freshUserPermission = res.data;
        } else {
          this.userPermission = [];
          this.freshUserPermission = []
          this.selectedRole = null;
        }
        this.isUserPermissionsLoading = false;
      },
      (err) => {
        this.isUserPermissionsLoading = false;
      }
    );
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


  submit() {
    if (this.userPermissionForm.valid) {
      let data = [{
        _id: this.selectedRoleForEdit._id,
        roleName: this.userPermissionForm.get("roleName")?.value,
        modules: [...this.selectedRoleForEdit?.modules],
      }];

      this.hospitalService
        .newEditUserRolePermission(data)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
    } else {
      this.userPermissionForm.markAllAsTouched();
    }
  }
}
