import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PermissionDialogComponent } from "./dialog/permission-dialog/permission-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "app-user-permission",
  templateUrl: "./user-permission.component.html",
  styleUrls: ["./user-permission.component.scss"],
})
export class UserPermissionComponent implements OnInit {
  userPermission: any = [];
  selectedRole: any;
  userPermissionForm: FormGroup;
  objectKeys = Object.keys;

  roleTypeArray = ["supreme", "facilitator", "hospital"];

  constructor(
    private supremeService: SupremeService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getUserPermission();
    this.buildForm();
  }
  onSelect(event) {
    for (var i = 0; i < this.selectedRole?.modules.length; i++) {
      for (var key in this.selectedRole?.modules[i].permission) {
        if (this.selectedRole?.modules[i].permission.hasOwnProperty(key)) {
          if (event.checked) {
            this.selectedRole.modules[i].permission[key] = true;
          } else {
            this.selectedRole.modules[i].permission[key] = false;
          }
        }
      }
    }
  }
  buildForm() {
    this.userPermissionForm = this.formBuilder.group({
      roleName: ["", [Validators.required]],
      roleType: ["", [Validators.required]],
    });
  }
  addUserPermission() {
    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getUserPermission();
      }
    });
  }

  isUserPermissionsLoading = true;
  selectedPermissionId: any;
  getUserPermission() {
    this.isUserPermissionsLoading = true;
    this.supremeService.getAllPermissionDB().subscribe(
      (res: any) => {
        if (res?.data?.length) {
          this.userPermission = res?.data;
          this.userPermission?.map((obj) => {
            obj.active = false;
          });
          this.userPermission[0].active = true;
          let roleType = this.userPermission[0]?.roleType || "supreme";
          this.selectedPermissionId = this.userPermission[0]?._id;
          this.changeRoleType(roleType, this.userPermission[0]?._id);
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

  isPermissionsLoading = false;
  getUserPermissionById(id) {
    this.isPermissionsLoading = true;
    this.supremeService
      .getPermissionDbById(id, this.permissionParams)
      .subscribe(
        (res: any) => {
          this.selectedRole = res.data[0];
          console.log(this.selectedRole);

          this.userPermissionForm.patchValue({
            roleName: this.selectedRole.roleName,
          });
          this.isPermissionsLoading = false;
        },
        (err) => {
          this.isPermissionsLoading = true;
        }
      );
  }
  onActive(obj) {
    this.userPermission.map((obj: any) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedPermissionId = obj?._id;
    let roleType = obj.roleType || "supreme";
    this.changeRoleType(roleType, obj?._id);
    // this.getUserPermissionById(obj._id);
  }
  formSubmit() {
    if (this.userPermissionForm.valid) {
      const data = {
        roleName: this.userPermissionForm.value.roleName,
        modules: this.selectedRole.modules,
      };
      this.supremeService
        .editUserRolePermission(this.selectedRole._id, data)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.getUserPermissionById(this.selectedRole._id);
        });
    } else {
      Object.keys(this.userPermissionForm.controls).forEach((key) => {
        this.userPermissionForm.controls[key].markAsTouched();
      });
    }
  }
  deleteUserPermission(id: string) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.supremeService.deletUserPermission(id).subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getUserPermission();
          });
        }
      });
  }

  // change role type
  permissionParams: any = {};
  changeRoleType(type: string, id: any) {
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

    this.getUserPermissionById(id);
  }
}
