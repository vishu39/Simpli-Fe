import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-shared-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  @Output("submitForm") submitForm: EventEmitter<any> = new EventEmitter();
  changePasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
  buildForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ["", [Validators.required, Validators.minLength(8)]],
      newPassword: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  formSubmit() {
    if (this.changePasswordForm.valid) {
      this.submitForm.emit(this.changePasswordForm.value);
    } else {
      Object.keys(this.changePasswordForm.controls).forEach((key) => {
        this.changePasswordForm.controls[key].markAsTouched();
      });
    }
  }
}
