import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/core/service/shared/shared.service';
import { FacilitatorService } from 'src/app/core/service/facilitator/facilitator.service';
import { SupremeService } from 'src/app/core/service/supreme/supreme.service';
@Component({
  selector: 'app-hospital-password-dialog',
  templateUrl: './hospital-password-dialog.component.html',
  styleUrls: ['./hospital-password-dialog.component.scss']
})
export class HospitalPasswordDialogComponent implements OnInit {
  dialogTitle: string;
  hospitalPasswordForm: FormGroup;
  hospitalPasswordId:string;

  constructor(
    private dialogRef: MatDialogRef<HospitalPasswordDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private supremeService: SupremeService,

  ) {
    this.buildForm();
  }

  buildForm() {
    this.hospitalPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required,Validators.minLength(10)]],
    })
  }
  ngOnInit(): void {

  }


  formSubmit() {
    if (this.hospitalPasswordForm.valid) {
        this.supremeService.editHospitalPassword(this.hospitalPasswordId,this.hospitalPasswordForm.value).subscribe(
          (res: any) => {
            this.sharedService.showNotification(
              'snackBar-success',
              res.message,
            );
            this.closeDialog(true);
          }
        )      
    }
    else {
      Object.keys(this.hospitalPasswordForm.controls).forEach(key => {
        this.hospitalPasswordForm.controls[key].markAsTouched()
      });
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }

  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
 

}
