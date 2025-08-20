import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
@Component({
  selector: 'shared-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userProfileForm: FormGroup;
  userProfileData: any;
  isLoading:Boolean=true;

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
  ) {
  }
  ngOnInit(): void {
    this.buildForm();
    this.getProfile();

  }
  buildForm() {
    this.userProfileForm = this.formBuilder.group({
      designation: ['', [Validators.required]],
    })
  }
  getProfile() {
    this.isLoading=true;
    this.facilitatorService.getProfile().subscribe(
      (res: any) => {
        this.userProfileData = res.data;
        this.isLoading=false;
        if (this.userProfileData) {
          this.userProfileForm.patchValue({
            designation: this.userProfileData.designation,
          })
        }
      },(err)=>{
        this.isLoading=false;
      }
    )
  }
  formSubmit() {
    // console.log('this.userProfileForm', this.userProfileForm.value)
    if (this.userProfileForm.valid) {
      this.facilitatorService.editProfile(this.userProfileForm.value).subscribe(
        (res: any) => {
          this.sharedService.showNotification(
            'snackBar-success',
            res.message,
          );
        }
      )
    }
    else {
      Object.keys(this.userProfileForm.controls).forEach(key => {
        this.userProfileForm.controls[key].markAsTouched()
      });
    }
  }

}
