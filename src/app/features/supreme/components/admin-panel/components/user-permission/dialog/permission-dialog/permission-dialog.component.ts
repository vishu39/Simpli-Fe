import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { timeStamp } from "console";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-permission-dialog",
  templateUrl: "./permission-dialog.component.html",
  styleUrls: ["./permission-dialog.component.scss"],
})
export class PermissionDialogComponent implements OnInit {
  userPermisison: any;
  userPermissionForm: FormGroup;
  objectKeys = Object.keys;

  roleTypeArray = ["supreme", "facilitator", "hospital"];

  constructor(
    private supremeService: SupremeService,
    private dialogRef: MatDialogRef<PermissionDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.changeRoleType("supreme");
    // this.getUserPermission();
  }
  buildForm() {
    this.userPermissionForm = this.formBuilder.group({
      roleName: ["", [Validators.required]],
      roleType: ["", [Validators.required]],
    });
  }
  getUserPermission() {
    this.supremeService
      .getAllPermission(this.permissionParams)
      .subscribe((res: any) => {
        this.userPermisison = res.data;
        // console.log('this.userPermisison', this.userPermisison)
      });
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
  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
  formSubmit() {
    if (this.userPermissionForm.valid) {
      const data = {
        roleName: this.userPermissionForm.value.roleName,
        roleType: this.userPermissionForm.value.roleType,
        modules: [...this.userPermisison],
      };

      // console.log('data', data)
      this.supremeService.addUserRolePermission(data).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeDialog(true);
      });
    } else {
      Object.keys(this.userPermissionForm.controls).forEach((key) => {
        this.userPermissionForm.controls[key].markAsTouched();
      });
    }
  }

  // change role type
  permissionParams: any = {};
  changeRoleType(type: string) {
    this.userPermissionForm.patchValue({
      roleType: type,
    });
    switch (type) {
      case "supreme":
        this.permissionParams = {
          isSupreme: true,
        };
        break;
      case "facilitator":
        this.permissionParams = {
          isFacilitator: true,
        };
        break;
      case "hospital":
        this.permissionParams = {
          isHospital: true,
        };
        break;
    }
    this.getUserPermission();
  }
}
