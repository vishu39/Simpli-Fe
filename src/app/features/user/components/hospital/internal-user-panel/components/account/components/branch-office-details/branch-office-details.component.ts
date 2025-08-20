import { ChangeDetectorRef, Component, OnInit,ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: 'app-branch-office-details',
  templateUrl: './branch-office-details.component.html',
  styleUrls: ['./branch-office-details.component.scss']
})
export class BranchOfficeDetailsComponent implements OnInit {
  branchOfficeDetailsForm: FormGroup;
  branchOfficeDetailsData: any = null;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  address: FormArray;
  isLoading:Boolean=true;
  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
  }
  ngOnInit(): void {
    this.buildForm();
    this.getBranchOfficeDetails();

  }
  buildForm() {
    this.branchOfficeDetailsForm = this.formBuilder.group({
      address: this.formBuilder.array([this.createAddress()]),
    })
  }
  getBranchOfficeDetails() {
    this.isLoading=true
    this.facilitatorService.getBranchOfficeDetails().subscribe(
      (res: any) => {
        this.branchOfficeDetailsData = res.data;
        this.isLoading=false
        // console.log('this.branchOfficeDetailsData', this.branchOfficeDetailsData)
        if (this.branchOfficeDetailsData) {        
          this.address = this.branchOfficeDetailsForm.get('address') as FormArray;
          this.address.controls=[]
          for (let i = 0; i < this.branchOfficeDetailsData.address.length; i++){
            this.addAddress();
          }
          this.branchOfficeDetailsForm.patchValue({
            address: this.branchOfficeDetailsData.address,
          })
        }
      },(err)=>{
        this.isLoading=false;
      }

    )
  }

  createAddress(): FormGroup {
    return this.formBuilder.group({
      id: this.address?.length + 1 ? this.address?.length + 1 : 1,
      line: ['', [Validators.required]],
    });
  }
  addAddress(): void {
    this.address = this.branchOfficeDetailsForm.get('address') as FormArray;
    this.address.push(this.createAddress());
  }
  removeAddress(i: number) {
    if (i > 0) {
      this.address.removeAt(i);

    }
  }

  formSubmit() {
    // console.log('this.branchOfficeDetailsForm', this.branchOfficeDetailsForm.value)
    if (this.branchOfficeDetailsForm.valid) {
      if (!this.branchOfficeDetailsData) {
        this.facilitatorService.addBranchOfficeDetails(this.branchOfficeDetailsForm.value).subscribe(
          (res: any) => {
            this.sharedService.showNotification(
              'snackBar-success',
              res.message,
            );
            this.formDirective.resetForm(); // Reset the ugly validators
            this.getBranchOfficeDetails();
          }
        )
      }
      else {
        this.facilitatorService.editBranchOfficeDetails(this.branchOfficeDetailsForm.value).subscribe(
          (res: any) => {
            this.sharedService.showNotification(
              'snackBar-success',
              res.message,
            );
            this.formDirective.resetForm(); // Reset the ugly validators
            this.getBranchOfficeDetails();
          }
        )
      }
    }
    else {
      Object.keys(this.branchOfficeDetailsForm.controls).forEach(key => {
        this.branchOfficeDetailsForm.controls[key].markAsTouched()
      });
    }
  }

}
