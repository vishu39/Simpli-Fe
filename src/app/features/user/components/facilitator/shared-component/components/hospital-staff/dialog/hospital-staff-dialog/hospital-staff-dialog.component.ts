import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-hospital-staff-dialog",
  templateUrl: "./hospital-staff-dialog.component.html",
  styleUrls: ["./hospital-staff-dialog.component.scss"],
})
export class HospitalStaffDialogComponent implements OnInit {
  hospitalStaffForm: FormGroup;
  hospitalStaffData: any;
  dialogTitle: string;

  // Hospital Linking
  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll = false;
  selectedHospitalSearch: any = [];

  typeData = ["employee", "doctor"];

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<HospitalStaffDialogComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.getHospitalData(false);
  }
  buildForm() {
    this.hospitalStaffForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      type: ["", [Validators.required]],
      contact: [
        "",
        [Validators.required, Validators.pattern(regexService.contactRegex)],
      ],
      emailId: [
        "",
        [Validators.required, Validators.pattern(regexService.emailRegex)],
      ],
      hospital: [[], [Validators.required]],
    });
  }

  formSubmit() {
    // console.log('this.hospitalStaffForm', this.hospitalStaffForm.value)
    if (this.hospitalStaffForm.valid) {
      if (!this.hospitalStaffData) {
        this.facilitatorService
          .addHospitalStaff(this.hospitalStaffForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.facilitatorService
          .editHospitalStaff(
            this.hospitalStaffData._id,
            this.hospitalStaffForm.value
          )
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.hospitalStaffForm.controls).forEach((key) => {
        this.hospitalStaffForm.controls[key].markAsTouched();
      });
    }
  }

  // Hospital Linking

  getHospitalData(selectAll: Boolean) {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.hospitalData = [];
        }

        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
        this.isLoadingHospital = false;
        if (selectAll) {
          const allHospital = this.hospitalData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedHospitalSearch.some(
              (selectedHospital) => selectedHospital._id === hospital._id
            );

            if (!isHospitalAlreadySelected) {
              this.selectedHospitalSearch.push(hospital);
            }
          });

          this.hospitalStaffForm.patchValue({
            hospital: this.selectedHospitalSearch,
          });
          this.isLoadingHospitalSelectAll = false;
        }
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getHospitalData(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getHospitalData(false);
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedHospitalSearch.push(item);
    }
    this.hospitalStaffForm.patchValue({
      hospital: [...new Set(this.selectedHospitalSearch)],
    });
    // console.log('hospital', this.hospitalStaffForm.get('hospital').value)
    // console.log('this.selectedHospitalSearch', this.selectedHospitalSearch)
  }
  selectAllHospital(event) {
    if (event.checked) {
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 0;
      this.isLoadingHospital = false;
      this.isLoadingHospitalSelectAll = true;
      this.getHospitalData(true);
    } else {
      this.selectedHospitalSearch = [];
      this.hospitalStaffForm.patchValue({
        hospital: [],
      });
    }
  }
  onEdit(data: any) {
    // console.log('data',data)
    this.hospitalStaffData = data;
    this.selectedHospitalSearch = this.hospitalStaffData.hospital;
    this.hospitalStaffForm.patchValue({
      name: this.hospitalStaffData.name,
      type: this.hospitalStaffData.type,
      contact: this.hospitalStaffData.contact,
      emailId: this.hospitalStaffData.emailId,
      hospital: this.selectedHospitalSearch,
    });
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
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
