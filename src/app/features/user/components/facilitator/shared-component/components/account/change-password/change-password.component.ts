import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
@Component({
  selector: 'shared-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  passwordData: any;

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
  ) {
  }
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
      oldPassword: ['', [Validators.required,Validators.minLength(8)]],
      newPassword: ['', [Validators.required,Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(8)]],
    })
  }

  formSubmit() {
    // console.log('this.changePasswordForm', this.changePasswordForm.value)
    if (this.changePasswordForm.valid) {
      this.facilitatorService.changePassword(this.changePasswordForm.value).subscribe(
        (res: any) => {
          localStorage.clear();
          location.reload();
          this.sharedService.showNotification(
            'snackBar-success',
            res.message,
          );
        }
      )
    }
    else {
      Object.keys(this.changePasswordForm.controls).forEach(key => {
        this.changePasswordForm.controls[key].markAsTouched()
      });
    }
  }

}
