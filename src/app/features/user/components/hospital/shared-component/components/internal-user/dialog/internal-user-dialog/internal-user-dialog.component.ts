import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { treatingDoctorUserType } from "src/app/core/models/role";

@Component({
  selector: "app-hospital-internal-user-dialog",
  templateUrl: "./internal-user-dialog.component.html",
  styleUrls: ["./internal-user-dialog.component.scss"],
})
export class InternalUserDialogComponent implements OnInit {
  dialogTitle: string;
  internalUserForm: FormGroup;
  internalUserData;
  roleData: any;
  userTypeData: any;

  // Country Linking
  countryData: any = [];
  totalElementCountry: number;
  countryParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeoutCountry = null;
  isLoadingCountry = false;

  // City Linking

  cityData: any = [];
  totalElementCity: number;
  cityParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutCity = null;
  isLoadingCity = false;

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

  treatingDoctorUserType = treatingDoctorUserType;

  constructor(
    private dialogRef: MatDialogRef<InternalUserDialogComponent>,
    private supremeService: SupremeService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {
    this.buildForm();
    this.getCountryData();
    this.getCityData();
    this.getHospitalAdminUserType();
    this.getHospitalData(false);
    this.getDoctorData();
  }

  doctorData = [];
  totalElement: number;
  doctorParams = {
    page: 1,
    limit: 10,
    search: "",
  };

  timeoutDoctor = null;
  isDoctorLoading: boolean = true;
  getDoctorData() {
    this.isDoctorLoading = true;
    this.sharedService.getAllDoctor(this.doctorParams).subscribe(
      (res: any) => {
        this.doctorData.push(...res.data.content);
        this.totalElement = res.data.totalElement;
        this.doctorParams.page = this.doctorParams.page + 1;
        this.isDoctorLoading = false;
      },
      (err) => {
        this.isDoctorLoading = false;
      }
    );
  }

  onInfiniteScrollDoctor(): void {
    if (this.doctorData.length < this.totalElement) {
      this.getDoctorData();
    }
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.doctorParams.search = filterValue.trim();
      this.doctorParams.page = 1;
      this.doctorParams.limit = 10;
      this.doctorData = [];
      this.isLoadingHospital = false;
      this.getDoctorData();
    }, 600);
  }

  doctorId: any;
  onClickDoctor(item: any) {
    this.doctorId = item?._id;
    this.internalUserForm.patchValue({
      designation: item?.designation,
    });
    this.getDoctorById(this.doctorId);
  }

  getDoctorById(id: string) {
    this.sharedService.startLoader();
    this.sharedService
      .getCmsData(`getDoctor/${id}`, {})
      .subscribe((res: any) => {
        if (res?.data) {
          this.internalUserForm.patchValue({
            emailId: res?.data?.emailId,
          });
          this.sharedService.stopLoader();
        }
      });
  }

  onTypeChange(type: any) {
    if (type === "treating doctor") {
      this.internalUserForm.reset({
        userType: type,
        blocked: false,
      });
    }
  }

  buildForm() {
    this.internalUserForm = this.formBuilder.group({
      name: [, [Validators.required]],
      emailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
      contact: [
        "",
        [Validators.required, Validators.pattern(regexService.contactRegex)],
      ],
      role: ["", [Validators.required]],
      country: [null, [Validators.required]],
      userType: ["", [Validators.required]],
      city: [null, [Validators.required]],
      designation: ["", [Validators.required]],
      hospital: [[], [Validators.required]],
      blocked: [false, []],
    });
  }
  ngOnInit(): void {
    this.getAllRole();
  }

  getAllRole() {
    this.hospitalService.getAllRole().subscribe((res: any) => {
      this.roleData = res.data;
    });
  }
  internalUserFormSubmit() {
    if (this.internalUserForm.valid) {
      console.log({ ...this.internalUserForm.value, doctorId: this.doctorId });

      if (this.internalUserData == undefined) {
        this.hospitalService
          .addInternalUser(
            this.internalUserForm.get("userType")?.value === "treating doctor"
              ? { ...this.internalUserForm.value, doctorId: this.doctorId }
              : this.internalUserForm.value
          )
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.hospitalService
          .editInternalUser(
            this.internalUserData._id,
            this.internalUserForm.get("userType")?.value === "treating doctor"
              ? { ...this.internalUserForm.value, doctorId: this.doctorId }
              : this.internalUserForm.value
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
      Object.keys(this.internalUserForm.controls).forEach((key) => {
        this.internalUserForm.controls[key].markAsTouched();
      });
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
  onEdit(data) {
    this.internalUserData = data;
    this.selectedHospitalSearch = this.internalUserData.hospital;
    this.internalUserForm.patchValue({
      name: this.internalUserData.name,
      emailId: this.internalUserData.emailId,
      password: this.internalUserData.password,
      contact: this.internalUserData.contact,
      designation: this.internalUserData.designation,
      country: this.internalUserData.country,
      city: this.internalUserData.city,
      userType: this.internalUserData.userType,
      blocked: this.internalUserData.blocked,
      role: this.internalUserData?.role?._id,
      hospital: this.selectedHospitalSearch,
    });
  }

  // Country linking
  getCountryData() {
    if (this.isLoadingCountry) {
      return;
    }
    this.isLoadingCountry = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParams)
      .subscribe((res: any) => {
        this.countryData.push(...res.data.content);
        this.totalElementCountry = res.data.totalElement;
        this.countryParams.page = this.countryParams.page + 1;
        this.isLoadingCountry = false;
      });
  }
  onInfiniteScrollCountry(): void {
    if (this.countryData.length < this.totalElementCountry) {
      this.getCountryData();
    }
  }

  searchCountry(filterValue: string) {
    clearTimeout(this.timeoutCountry);
    this.timeoutCountry = setTimeout(() => {
      this.countryParams.search = filterValue.trim();
      this.countryParams.page = 1;
      this.countryData = []; // Clear existing data when searching
      this.isLoadingCountry = false;
      this.getCountryData();
    }, 600);
  }
  // City Linking
  getCityData() {
    if (this.isLoadingCity) {
      return;
    }
    this.isLoadingCity = true;

    this.sharedService
      .getCmsData("getAllCity", this.cityParams)
      .subscribe((res: any) => {
        this.cityData.push(...res.data.content);
        this.totalElementCity = res.data.totalElement;
        this.cityParams.page = this.cityParams.page + 1;
        this.isLoadingCity = false;
      });
  }
  onInfiniteScrollCity(): void {
    if (this.cityData.length < this.totalElementCity) {
      this.getCityData();
    }
  }

  searchCity(filterValue: string) {
    clearTimeout(this.timeoutCity);
    this.timeoutCity = setTimeout(() => {
      this.cityParams.search = filterValue.trim();
      this.cityParams.page = 1;
      this.cityData = []; // Clear existing data when searching
      this.isLoadingCity = false;
      this.getCityData();
    }, 600);
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  getHospitalAdminUserType() {
    this.sharedService.getHospitalAdminUserType().subscribe((res: any) => {
      this.userTypeData = res.data;
    });
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

          this.internalUserForm.patchValue({
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
    this.internalUserForm.patchValue({
      hospital: [...new Set(this.selectedHospitalSearch)],
    });
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
      this.internalUserForm.patchValue({
        hospital: [],
      });
    }
  }
  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
