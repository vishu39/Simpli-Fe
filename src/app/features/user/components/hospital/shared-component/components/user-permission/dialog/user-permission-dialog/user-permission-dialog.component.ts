import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "hospital-user-permission-dialog",
  templateUrl: "./user-permission-dialog.component.html",
  styleUrls: ["./user-permission-dialog.component.scss"],
})
export class UserPermissionDialogComponent implements OnInit {
  userPermisison: any;
  userPermissionForm: FormGroup;
  objectKeys = Object.keys;

  constructor(
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<UserPermissionDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.getUserPermission();
  }
  onSelect(event) {
    for (var i = 0; i < this.userPermisison.length; i++) {
      for (var key in this.userPermisison[i].permission) {
        if (this.userPermisison[i].permission.hasOwnProperty(key)) {
          if (event.checked) {
            this.userPermisison[i].permission[key] = true;
          } else {
            this.userPermisison[i].permission[key] = false;
          }
        }
      }
    }
  }
  buildForm() {
    this.userPermissionForm = this.formBuilder.group({
      roleName: ["", [Validators.required]],
    });
  }
  getUserPermission() {
    this.hospitalService.getAllPermission().subscribe((res: any) => {
      this.userPermisison = res.data;
      // console.log('this.userPermisison', this.userPermisison)
    });
  }
  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
  formSubmit() {
    if (this.userPermissionForm.valid) {
      const data = {
        roleName: this.userPermissionForm.value.roleName,
        modules: [...this.userPermisison],
      };
      // console.log('data',data)
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
