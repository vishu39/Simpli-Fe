import { Component, OnInit,ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
@Component({
  selector: 'shared-template-setting',
  templateUrl: './template-setting.component.html',
  styleUrls: ['./template-setting.component.scss']
})
export class TemplateSettingComponent implements OnInit {

  templateSettingForm: FormGroup;
  templateSettingData: any;
  isLoading:Boolean=true;

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
  ) {
  }
  ngOnInit(): void {
    this.buildForm();
    this.getTemplateSetting();

  }
  buildForm() {
    this.templateSettingForm = this.formBuilder.group({
      bgColor: ['', [Validators.required]],
      profileColor: ['', [Validators.required]],
    })
  }
  getTemplateSetting() {
    this.isLoading=true;
    this.facilitatorService.getTemplateSetting().subscribe(
      (res: any) => {
        this.templateSettingData = res.data;
        this.isLoading=false;
        if (this.templateSettingData) {        
          this.templateSettingForm.patchValue({
            bgColor: this.templateSettingData.bgColor,
            profileColor: this.templateSettingData.profileColor
          })
        }
      },(err)=>{
        this.isLoading=false;
      }
    )
  }


  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }

  }

  formSubmit() {
    // console.log('this.templateSettingForm', this.templateSettingForm.value)
    if (this.templateSettingForm.valid) {
      if (!this.templateSettingData) {
        this.facilitatorService.addTemplateSetting(this.templateSettingForm.value).subscribe(
          (res: any) => {
            this.sharedService.showNotification(
              'snackBar-success',
              res.message,
            );
          }
        )
      }
      else {
        this.facilitatorService.editTemplateSetting(this.templateSettingData?._id,this.templateSettingForm.value).subscribe(
          (res: any) => {
            this.sharedService.showNotification(
              'snackBar-success',
              res.message,
            );
          }
        )
      }
    }
    else {
      Object.keys(this.templateSettingForm.controls).forEach(key => {
        this.templateSettingForm.controls[key].markAsTouched()
      });
    }
  }

}
