import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "app-user-dialog",
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.scss"],
})
export class UserDialogComponent implements OnInit {
  dialogTitle: string;
  userForm: FormGroup;
  roleData: any;
  userData: any;
  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private supremeService: SupremeService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }
  buildForm() {
    this.userForm = this.formBuilder.group({
      userName: ["", [Validators.required]],
      emailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
      blocked: [false, []],
      role: ["", [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.getAllRole();
  }
  getAllRole() {
    this.supremeService.getAllRole().subscribe((res: any) => {
      this.roleData = res.data;
    });
  }
  userFormSubmit() {
    if (this.userForm.valid) {
      if (this.userData == undefined) {
        this.supremeService
          .addUser(this.userForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.supremeService
          .editUser(this.userData._id, this.userForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.controls[key].markAsTouched();
      });
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
  onEdit(data) {
    this.userData = data;
    this.userForm.patchValue({
      userName: this.userData.userName,
      emailId: this.userData.emailId,
      password: this.userData.password,
      blocked: this.userData.blocked,
      role: this.userData?.role?._id,
    });
  }
  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
}
