import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "global-shared-add-hospital-uhid",
  templateUrl: "./add-hospital-uhid.component.html",
  styleUrls: ["./add-hospital-uhid.component.scss"],
})
export class AddHospitalUhidComponent implements OnInit {
  dialogTitle: string = "";
  patientData: any = {};
  isEdit: boolean = false;

  editingData: any = {};

  formGroup: FormGroup;

  freshPatientConfirmationData: any;
  freshPatientConfirmationDataForUHID: any;
  allPatientConfirmationRequest: any;
  isPatientLoading = true;

  constructor(
    public dialogRef: MatDialogRef<AddHospitalUhidComponent>,
    private fb: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      hospitalUHID: ["", [Validators.required]],
      patient: [this.patientData?._id],
    });

    this.getHospitalData();

    if(this.isEdit){
      this.getHospitalUhidForFinanceBillingById()
    }
  }

  docDataForEdit:any= {};
  getHospitalUhidForFinanceBillingById() {
    this.facilitatorService
      .getHospitalUhidForFinanceBillingById(this.patientData?._id, {
        hospitalId: this.editingData?.hospitalId,
      })
      .subscribe((res: any) => {
        this.docDataForEdit = res?.data[0];
        this.patchData(this.docDataForEdit)
      });
  }

  patchData(item:any){
    this.formGroup.patchValue({
      hospitalId: item?.hospitalId,
      hospitalName: item?.hospitalName,
      hospitalUHID: item?.hospitalUHID,
      patient: [this.patientData?._id],
    })

        this.formGroup.get('hospitalName').disable()
  }

  // Hospital linking
  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutHospital = null;
  isLoadingHospital = false;

  getHospitalData() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService.getAllHospital(this.hospitalParams).subscribe(
      (res: any) => {
        if (!!res?.data?.content && res?.data?.content?.length > 0) {
          this.hospitalData.push(...res.data.content);
          this.totalElementHospital = res.data.totalElement;
          this.hospitalParams.page = this.hospitalParams.page + 1;
          this.isLoadingHospital = false;
        } else {
          this.isLoadingHospital = false;
        }
      },
      () => {
        this.isLoadingHospital = false;
      }
    );
  }

  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getHospitalData();
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalData = [];
      this.isLoadingHospital = false;
      this.getHospitalData();
    }, 600);
  }

  onChangeHospital(name: any) {
    this.formGroup.patchValue({
      hospitalName: name,
    });
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close({
      apiCall,
    });
  }

  actionSubmit() {
    if (this.isEdit) {
      this.editFinalForm();
    } else {
      this.addFinalForm();
    }
  }

  addFinalForm() {
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };

      this.facilitatorService
        .addHospitalUhidForFinanceBilling(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }

  editFinalForm() {
    let id = this.patientData._id;
    if (this.formGroup.valid) {
      let payload = {
        ...this.formGroup.getRawValue(),
      };
      this.facilitatorService
        .editHospitalUhidForFinanceBilling(id, payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);

          this.closeDialog(true);
        });
    }
  }
}
