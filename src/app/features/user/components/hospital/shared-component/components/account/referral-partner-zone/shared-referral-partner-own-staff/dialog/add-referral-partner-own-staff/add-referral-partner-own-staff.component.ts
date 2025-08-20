import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-add-referral-partner-own-staff",
  templateUrl: "./add-referral-partner-own-staff.component.html",
  styleUrls: ["./add-referral-partner-own-staff.component.scss"],
})
export class AddReferralPartnerOwnStaffComponent implements OnInit {
  referralPartnerStaffForm: FormGroup;
  referralPartnerStaffData: any;
  dialogTitle: string;

  // Hospital Linking
  referralPartnerData: any = [];
  freshReferralPartnerData: any = [];
  totalElementReferralPartner: number;
  referralPartnerParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutReferralPartner = null;
  isLoadingReferralPartner = false;
  isLoadingReferralPartnerSelectAll = false;
  selectedReferralPartnerSearch: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<AddReferralPartnerOwnStaffComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.getAllFacilitatorName(false);
    this.getAllInternalUser();
  }

  isInternalUserLoading = true;
  internalUserData: any = [];
  getAllInternalUser() {
    this.isInternalUserLoading = true;
    this.hospitalService
      .getAllEmployeeUserHopsital({ isQueryViewSetting: true })
      .subscribe(
        (res: any) => {
          this.internalUserData = res.data || [];
          this.isInternalUserLoading = false;
        },
        (err) => {
          this.isInternalUserLoading = false;
        }
      );
  }

  onClickUser(user: any) {
    this.referralPartnerStaffForm.patchValue({
      name: user?.name || "",
      contact: user?.contact || "",
      emailId: user?.emailId || "",
    });
  }

  buildForm() {
    this.referralPartnerStaffForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      contact: [
        "",
        [Validators.required, Validators.pattern(regexService.contactRegex)],
      ],
      emailId: [
        "",
        [Validators.required, Validators.pattern(regexService.emailRegex)],
      ],
      referralPartner: [[], [Validators.required]],
    });
  }

  formSubmit() {
    if (this.referralPartnerStaffForm.valid) {
      if (!this.referralPartnerStaffData) {
        this.hospitalService
          .addReferralPartnerStaff(this.referralPartnerStaffForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.hospitalService
          .editReferralPartnerStaff(
            this.referralPartnerStaffData._id,
            this.referralPartnerStaffForm.value
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
      Object.keys(this.referralPartnerStaffForm.controls).forEach((key) => {
        this.referralPartnerStaffForm.controls[key].markAsTouched();
      });
    }
  }

  // Hospital Linking

  getAllFacilitatorName(selectAll: Boolean) {
    if (this.isLoadingReferralPartner) {
      return;
    }
    this.isLoadingReferralPartner = true;

    this.hospitalService.getAllReferralPartner().subscribe((res: any) => {
      if (selectAll) {
        this.referralPartnerData = [];
      }

      this.referralPartnerData.push(...res.data);
      this.freshReferralPartnerData.push(...res.data);
      this.isLoadingReferralPartner = false;
      if (selectAll) {
        const allHospital = this.referralPartnerData.map((item) => ({
          _id: item._id,
          name: item.name,
        }));
        allHospital.forEach((hospital) => {
          const isHospitalAlreadySelected =
            this.selectedReferralPartnerSearch.some(
              (selectedHospital) => selectedHospital._id === hospital._id
            );

          if (!isHospitalAlreadySelected) {
            this.selectedReferralPartnerSearch.push(hospital);
          }
        });

        this.referralPartnerStaffForm.patchValue({
          referralPartner: this.selectedReferralPartnerSearch,
        });
        this.isLoadingReferralPartnerSelectAll = false;
      }
    });
  }

  onInfiniteScrollHospital(): void {
    // if (this.referralPartnerData.length < this.totalElementReferralPartner) {
    //   this.getAllFacilitatorName(false);
    // }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutReferralPartner);
    this.timeoutReferralPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshReferralPartnerData);
        this.referralPartnerData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.referralPartnerData = filterArray;
      } else {
        this.referralPartnerData = this.freshReferralPartnerData;
      }
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedReferralPartnerSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedReferralPartnerSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedReferralPartnerSearch.push(item);
    }
    this.referralPartnerStaffForm.patchValue({
      referralPartner: [...new Set(this.selectedReferralPartnerSearch)],
    });
  }

  selectAllHospital(event) {
    if (event.checked) {
      this.selectedReferralPartnerSearch = cloneDeep(this.referralPartnerData);
      this.referralPartnerStaffForm.patchValue({
        referralPartner: [...new Set(this.selectedReferralPartnerSearch)],
      });
    } else {
      this.selectedReferralPartnerSearch = [];
      this.referralPartnerStaffForm.patchValue({
        referralPartner: [],
      });
    }
  }

  onEdit(data: any) {
    // console.log('data',data)
    this.referralPartnerStaffData = data;
    this.selectedReferralPartnerSearch =
      this.referralPartnerStaffData.referralPartner;
    this.referralPartnerStaffForm.patchValue({
      name: this.referralPartnerStaffData.name,
      contact: this.referralPartnerStaffData.contact,
      emailId: this.referralPartnerStaffData.emailId,
      referralPartner: this.selectedReferralPartnerSearch,
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
