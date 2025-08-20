import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddUserPermissionComponent } from "./dialog/add-user-permission/add-user-permission.component";
import {
  userPermissionDisplayName,
  permissionDisplayName,
  camelCaseToNormal,
} from "src/app/shared/constant";
import { cloneDeep } from "lodash";
import { EditUserPermissionComponent } from "./dialog/edit-user-permission/edit-user-permission.component";
import { DeleteUserPermissionComponent } from "./dialog/delete-user-permission/delete-user-permission.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "shared-user-permission-revamp",
  templateUrl: "./user-permission-revamp.component.html",
  styleUrls: ["./user-permission-revamp.component.scss"],
})
export class UserPermissionRevampComponent implements OnInit {
  userPermission: any = [];
  selectedRole: any;
  userPermissionForm: FormGroup;
  objectKeys = Object.keys;

  userPermissionDisplayName = userPermissionDisplayName;
  permissionDisplayName = permissionDisplayName;
  camelCaseToNormal = camelCaseToNormal;

  constructor(
    private facilitatorService: FacilitatorService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllPermission();
    this.buildForm();
  }

  accordianToggleArray: any = [];
  onclickAccordian(index: number) {
    this.accordianToggleArray[index] = !this.accordianToggleArray[index];
  }

  onClickSelectAll(event: any, item: any) {
    let checked = event?.checked;
    const { mainIndex, permissionIndex, moduleName, roleName, key } = item;

    let permissionObj =
      this.permissionArrayAccordingToRoleIndex[mainIndex][permissionIndex]
        .permission;

    if (checked) {
      Object.keys(permissionObj).forEach((key) => {
        permissionObj[key] = true;
      });
    } else {
      Object.keys(permissionObj).forEach((key) => {
        permissionObj[key] = false;
      });
    }

    let obj = {
      key,
      mainIndex,
      permissionIndex,
      moduleName,
      roleName,
    };

    let findValue = this.knowChangeIndexArray?.findIndex((res: any) => {
      return (
        res?.mainIndex === mainIndex && res?.permissionIndex === permissionIndex
      );
    });

    if (findValue !== -1) {
      return;
    } else {
      this.knowChangeIndexArray.push(obj);
    }
  }

  knowChangeIndexArray: any = [];
  onClickCheckbox(
    event: any,
    mainIndex: number,
    permissionIndex: number,
    key: string,
    moduleName: string,
    roleName: string
  ) {
    let checked = event.checked;
    if (checked) {
      this.permissionArrayAccordingToRoleIndex[mainIndex][
        permissionIndex
      ].permission[key] = true;
    } else {
      this.permissionArrayAccordingToRoleIndex[mainIndex][
        permissionIndex
      ].permission[key] = false;
    }

    let obj = {
      key,
      mainIndex,
      permissionIndex,
      moduleName,
      roleName,
    };

    let findValue = this.knowChangeIndexArray?.findIndex((res: any) => {
      return (
        res?.mainIndex === mainIndex && res?.permissionIndex === permissionIndex
      );
    });

    if (findValue !== -1) {
      return;
    } else {
      this.knowChangeIndexArray.push(obj);
    }
  }

  isAllPermissionLoading = false;
  allPermissionList: any = [];
  getAllPermission() {
    this.isAllPermissionLoading = true;
    this.facilitatorService.getAllPermission().subscribe(
      (res: any) => {
        this.allPermissionList = res?.data;
        this.isAllPermissionLoading = false;
        this.getUserPermission();
      },
      () => {
        this.allPermissionList = [];
        this.isAllPermissionLoading = false;
      }
    );
  }

  buildForm() {
    this.userPermissionForm = this.formBuilder.group({
      roleName: ["", [Validators.required]],
    });
  }

  addUserPermission() {
    const dialogRef = this.dialog.open(AddUserPermissionComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPermission();
      }
    });
  }

  editUserPermission() {
    const dialogRef = this.dialog.open(EditUserPermissionComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPermission();
      }
    });
  }

  deleteUserPermission() {
    const dialogRef = this.dialog.open(DeleteUserPermissionComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllPermission();
      }
    });
  }

  isUserPermissionsLoading = false;
  getUserPermission() {
    this.isUserPermissionsLoading = true;
    this.facilitatorService.getAllPermissionDB().subscribe(
      (res: any) => {
        if (res?.data?.length) {
          this.userPermission = res?.data;
          this.findUserPermissionByRole();
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

  permissionArrayAccordingToRoleIndex: any = [];
  findUserPermissionByRole() {
    let permissionArray = cloneDeep(this.allPermissionList);
    let userPermissionArray = cloneDeep(this.userPermission);

    if (permissionArray?.length && userPermissionArray?.length) {
      this.permissionArrayAccordingToRoleIndex = permissionArray.map(
        (firstModule) => {
          return userPermissionArray.map((role) => {
            return (
              role.modules.find(
                (mod) => mod.moduleName === firstModule.moduleName
              ) || null
            );
          });
        }
      );
    }
  }

  submit() {
    if (this.knowChangeIndexArray?.length) {
      const finalObjMap: { [key: string]: any } = {};

      this.knowChangeIndexArray.forEach((kcia: any) => {
        const selectedMainObj = this.allPermissionList[kcia.mainIndex];
        const selectedPermissionObj = this.userPermission[kcia.permissionIndex];

        const moduleIndex = selectedPermissionObj?.modules?.findIndex(
          (m) => m?.moduleName === kcia?.moduleName
        );

        if (moduleIndex !== -1) {
          const updatedPermission =
            this.permissionArrayAccordingToRoleIndex?.[kcia.mainIndex]?.[
              kcia.permissionIndex
            ]?.permission;

          // Apply the update
          selectedPermissionObj.modules[moduleIndex].permission =
            updatedPermission;

          const existing = finalObjMap[selectedPermissionObj._id];

          if (existing) {
            // Replace module in existing modules list
            const modIndex = existing.modules.findIndex(
              (m) => m.moduleName === kcia.moduleName
            );
            if (modIndex !== -1) {
              existing.modules[modIndex].permission = updatedPermission;
            }
          } else {
            // Add a new entry
            finalObjMap[selectedPermissionObj._id] = {
              _id: selectedPermissionObj._id,
              roleName: selectedPermissionObj.roleName,
              modules: [...selectedPermissionObj.modules], // shallow copy
            };
          }
        }
      });

      const finalArray = Object.values(finalObjMap);

      if (finalArray.length) {
        this.facilitatorService
          .newEditUserRolePermission(finalArray)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }
    } else {
      this.sharedService.showNotification(
        "snackBar-danger",
        "There is nothing to change"
      );
    }
  }

  private isSyncingScroll = false;

  onHorizontalScroll(event: Event): void {
    if (this.isSyncingScroll) return;

    const source = event.target as HTMLElement;
    const scrollLeft = source.scrollLeft;

    this.isSyncingScroll = true;

    const containers =
      document.querySelectorAll<HTMLElement>(".synced-scroll-x");

    containers.forEach((container) => {
      if (container !== source) {
        container.scrollLeft = scrollLeft;
      }
    });

    setTimeout(() => {
      this.isSyncingScroll = false;
    }, 0);
  }

  originalOrder = (a: any, b: any): number => {
    return 0; // do not sort, keep insertion order
  };
}
