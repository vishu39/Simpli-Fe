import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { doctorStaffType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-add-doctor-staff",
  templateUrl: "./add-doctor-staff.component.html",
  styleUrls: ["./add-doctor-staff.component.scss"],
})
export class AddDoctorStaffComponent implements OnInit {
  doctorStaffForm: FormGroup;
  doctorStaffData: any;
  dialogTitle: string;

  // Doctor Linking
  doctorData: any = [];
  totalElementDoctor: number;
  doctorParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutDoctor = null;
  isLoadingDoctor = false;
  isLoadingDoctorSelectAll = false;
  selectedDoctorSearch: any = [];

  typeData = [doctorStaffType.assistantDoctor, doctorStaffType.coordinator];

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<AddDoctorStaffComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.getDoctorData(false);
  }
  buildForm() {
    this.doctorStaffForm = this.formBuilder.group({
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
      doctor: [[], [Validators.required]],
    });
  }

  formSubmit() {
    // console.log('this.doctorStaffForm', this.doctorStaffForm.value)
    if (this.doctorStaffForm.valid) {
      if (!this.doctorStaffData) {
        this.hospitalService
          .addDoctorStaff(this.doctorStaffForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.hospitalService
          .editDoctorStaff(this.doctorStaffData._id, this.doctorStaffForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.doctorStaffForm.controls).forEach((key) => {
        this.doctorStaffForm.controls[key].markAsTouched();
      });
    }
  }

  // Doctor Linking

  getDoctorData(selectAll: Boolean) {
    if (this.isLoadingDoctor) {
      return;
    }
    this.isLoadingDoctor = true;

    this.sharedService.getAllDoctor(this.doctorParams).subscribe((res: any) => {
      if (selectAll) {
        this.doctorData = [];
      }

      this.doctorData.push(...res.data.content);
      this.totalElementDoctor = res.data.totalElement;
      this.doctorParams.page = this.doctorParams.page + 1;
      this.isLoadingDoctor = false;
      if (selectAll) {
        const allDoctor = this.doctorData.map((item) => ({
          _id: item._id,
          name: item.name,
        }));
        allDoctor.forEach((doctor) => {
          const isDoctorAlreadySelected = this.selectedDoctorSearch.some(
            (selectedDoctor) => selectedDoctor._id === doctor._id
          );

          if (!isDoctorAlreadySelected) {
            this.selectedDoctorSearch.push(doctor);
          }
        });

        this.doctorStaffForm.patchValue({
          doctor: this.selectedDoctorSearch,
        });
        this.isLoadingDoctorSelectAll = false;
      }
    });
  }

  onInfiniteScrollDoctor(): void {
    if (this.doctorData.length < this.totalElementDoctor) {
      this.getDoctorData(false);
    }
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.doctorParams.search = filterValue.trim();
      this.doctorParams.page = 1;
      this.doctorParams.limit = 20;
      this.doctorData = []; // Clear existing data when searching
      this.isLoadingDoctor = false;
      this.getDoctorData(false);
    }, 600);
  }

  onClickDoctor(item) {
    const index = this.selectedDoctorSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDoctorSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDoctorSearch.push(item);
    }
    this.doctorStaffForm.patchValue({
      doctor: [...new Set(this.selectedDoctorSearch)],
    });
  }

  selectAllDoctor(event) {
    if (event.checked) {
      this.doctorParams.page = 1;
      this.doctorParams.limit = 0;
      this.isLoadingDoctor = false;
      this.isLoadingDoctorSelectAll = true;
      this.getDoctorData(true);
    } else {
      this.selectedDoctorSearch = [];
      this.doctorStaffForm.patchValue({
        doctor: [],
      });
    }
  }
  onEdit(data: any) {
    // console.log('data',data)
    this.doctorStaffData = data;
    this.selectedDoctorSearch = this.doctorStaffData.doctor;
    this.doctorStaffForm.patchValue({
      name: this.doctorStaffData.name,
      type: this.doctorStaffData.type,
      contact: this.doctorStaffData.contact,
      emailId: this.doctorStaffData.emailId,
      doctor: this.selectedDoctorSearch,
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
