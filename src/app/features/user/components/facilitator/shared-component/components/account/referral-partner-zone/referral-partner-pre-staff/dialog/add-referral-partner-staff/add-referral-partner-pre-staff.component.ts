import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-add-referral-partner-pre-staff",
  templateUrl: "./add-referral-partner-pre-staff.component.html",
  styleUrls: ["./add-referral-partner-pre-staff.component.scss"],
})
export class AddReferralPartnerPreStaffComponent implements OnInit {
  referralPartnerStaffForm: FormGroup;
  referralPartnerStaffData: any;
  dialogTitle: string;

  // Hospital Linking
  referralPartnerData: any = [];
  referralPartnerFreshData: any = [];
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
    private dialogRef: MatDialogRef<AddReferralPartnerPreStaffComponent>,
    private facilitatorService: FacilitatorService
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    // this.getAllFacilitatorName(false);
    this.getAdminDetails();
    this.getAllInternalUser();
  }

  isInternalUserLoading = true;
  internalUserData: any = [];
  getAllInternalUser() {
    this.isInternalUserLoading = true;
    this.facilitatorService.getAllEmployeeUser().subscribe(
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
      employee: [""],
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
        let newObj = {
          ...this.referralPartnerStaffForm.value,
        };

        newObj["referralPartner"] = [
          ...this.allReferralPartner,
          ...this.selectedReferralPartnerSearch,
        ];

        this.supremeService
          .editReferralPartnerStaff(this.referralPartnerStaffData._id, newObj)
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

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutReferralPartner);
    this.timeoutReferralPartner = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.referralPartnerFreshData);
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
        this.referralPartnerData = this.referralPartnerFreshData;
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
    // console.log('hospital', this.referralPartnerStaffForm.get('hospital').value)
    // console.log('this.selectedReferralPartnerSearch', this.selectedReferralPartnerSearch)
  }

  selectAllHospital(event) {
    if (event.checked) {
      this.selectedReferralPartnerSearch = this.referralPartnerData;

      this.referralPartnerStaffForm.patchValue({
        referralPartner: this.selectedReferralPartnerSearch,
      });
    } else {
      this.selectedReferralPartnerSearch = [];
      this.referralPartnerStaffForm.patchValue({
        referralPartner: [],
      });
    }
  }

  getAdminDetails() {
    if (this.isLoadingReferralPartner) {
      return;
    }
    this.isLoadingReferralPartner = true;
    this.sharedService.getAdminDetails().subscribe(
      (res: any) => {
        this.referralPartnerData = [res?.data];
        this.referralPartnerFreshData = [res?.data];

        this.referralPartnerData[0].old_id = this.referralPartnerData[0]?._id;
        this.referralPartnerFreshData[0].old_id =
          this.referralPartnerData[0]?._id;

        this.referralPartnerData[0]._id =
          this.referralPartnerData[0]?.customerId;

        this.referralPartnerFreshData[0]._id =
          this.referralPartnerFreshData[0]?.customerId;

        if (this.referralPartnerStaffData?.referralPartner?.length > 0) {
          let id = this.referralPartnerData[0].customerId;

          let findAdminIdArray =
            this.referralPartnerStaffData?.referralPartner?.findIndex(
              (rp: any) => rp?._id === id
            );

          if (findAdminIdArray !== -1) {
            this.selectedReferralPartnerSearch = [
              this.referralPartnerStaffData?.referralPartner[findAdminIdArray],
            ];

            this.allReferralPartner.splice(findAdminIdArray, 1);

            this.referralPartnerStaffForm.patchValue({
              referralPartner: this.selectedReferralPartnerSearch,
            });
          }
        }

        this.isLoadingReferralPartner = false;
      },
      () => {
        this.isLoadingReferralPartner = false;
      }
    );
  }

  allReferralPartner: any = [];
  onEdit(data: any) {
    // console.log('data',data)
    this.referralPartnerStaffData = data;

    this.allReferralPartner = cloneDeep(
      this.referralPartnerStaffData?.referralPartner
    );

    this.referralPartnerStaffForm.patchValue({
      name: this.referralPartnerStaffData.name,
      contact: this.referralPartnerStaffData.contact,
      emailId: this.referralPartnerStaffData.emailId,
      // referralPartner: this.selectedReferralPartnerSearch,
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
