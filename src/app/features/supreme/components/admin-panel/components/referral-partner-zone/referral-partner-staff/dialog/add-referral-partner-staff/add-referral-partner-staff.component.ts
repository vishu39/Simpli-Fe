import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";

@Component({
  selector: "app-add-referral-partner-staff",
  templateUrl: "./add-referral-partner-staff.component.html",
  styleUrls: ["./add-referral-partner-staff.component.scss"],
})
export class AddReferralPartnerStaffComponent implements OnInit {
  referralPartnerStaffForm: FormGroup;
  referralPartnerStaffData: any;
  dialogTitle: string;

  // Hospital Linking
  referralPartnerData: any = [];
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
    private supremeService: SupremeService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<AddReferralPartnerStaffComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.getAllFacilitatorName(false);
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
    // console.log('this.referralPartnerStaffForm', this.referralPartnerStaffForm.value)
    if (this.referralPartnerStaffForm.valid) {
      if (!this.referralPartnerStaffData) {
        this.supremeService
          .addReferralPartnerStaff(this.referralPartnerStaffForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.supremeService
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

    this.supremeService
      .getAllFacilitatorName(this.referralPartnerParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.referralPartnerData = [];
        }

        this.referralPartnerData.push(...res.data.content);
        this.totalElementReferralPartner = res.data.totalElement;
        this.referralPartnerParams.page = this.referralPartnerParams.page + 1;
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
    if (this.referralPartnerData.length < this.totalElementReferralPartner) {
      this.getAllFacilitatorName(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutReferralPartner);
    this.timeoutReferralPartner = setTimeout(() => {
      this.referralPartnerParams.search = filterValue.trim();
      this.referralPartnerParams.page = 1;
      this.referralPartnerParams.limit = 20;
      this.referralPartnerData = []; // Clear existing data when searching
      this.isLoadingReferralPartner = false;
      this.getAllFacilitatorName(false);
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
    // console.log('hospital', this.referralPartnerStaffForm.get('hospital').value)
    // console.log('this.selectedReferralPartnerSearch', this.selectedReferralPartnerSearch)
  }
  selectAllHospital(event) {
    if (event.checked) {
      this.referralPartnerParams.page = 1;
      this.referralPartnerParams.limit = 0;
      this.isLoadingReferralPartner = false;
      this.isLoadingReferralPartnerSelectAll = true;
      this.getAllFacilitatorName(true);
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
