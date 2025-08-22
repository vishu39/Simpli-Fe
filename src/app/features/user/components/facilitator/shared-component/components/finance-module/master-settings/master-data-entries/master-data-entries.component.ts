import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SMToolBar } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";

@Component({
  selector: "shared-master-data-entries",
  templateUrl: "./master-data-entries.component.html",
  styleUrls: ["./master-data-entries.component.scss"],
})
export class MasterDataEntriesComponent implements OnInit {
  constructor(
    public svc: CommonService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  addCompanyForm: FormGroup;
  billingDocForm: FormGroup;
  estimateForm: FormGroup;
  admissionDischargeTrackerForm: FormGroup;
  finalBillForm: FormGroup;

  masterOptionsArray: any = [
    {
      name: "Company Master",
      value: "companyMaster",
      icon: "business",
      bgColor: "#E3F2FD", // light blue
      color: "#1565C0", // dark blue
      isSelected: false,
    },
    {
      name: "Hospital Payout Master",
      value: "hospitalPayoutMaster",
      icon: "local_hospital",
      bgColor: "#FCE4EC", // light pink
      color: "#C2185B", // dark pink/red
      isSelected: false,
    },
    {
      name: "Partner Payout Master",
      value: "partnerPayoutMaster",
      icon: "supervisor_account",
      bgColor: "#E8F5E9", // light green
      color: "#2E7D32", // dark green
      isSelected: false,
    },
    {
      name: "Sales Incentive Master",
      value: "salesIncentiveMaster",
      icon: "timeline",
      bgColor: "#FFF3E0", // light orange
      color: "#EF6C00", // dark orange
      isSelected: false,
    },
  ];

  selectedMasterOption: any = {};
  onClickMasterOption(item: any) {
    let findedIndex = this.masterOptionsArray?.findIndex(
      (ele: any) => ele?.value === item?.value
    );

    if (findedIndex !== -1) {
      this.masterOptionsArray.forEach((element: any) => {
        element.isSelected = false;
      });

      this.masterOptionsArray[findedIndex].isSelected = true;
      this.selectedMasterOption = this.masterOptionsArray[findedIndex];
    }
  }

  ngOnInit(): void {
    this.masterOptionsArray[0].isSelected = true;
    this.selectedMasterOption = this.masterOptionsArray[0];

    this.billingDocForm = this.fb.group({
      hospitalId: [""],
      hospitalName: [""],
      category: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      currency: ["", [Validators.required]],
      file: [],
    });

    this.estimateForm = this.fb.group({
      hospitalId: [""],
      hospitalName: [""],
      estimateGiven: ["", [Validators.required]],
      estimateDate: [""],
      approxAdmissionDate: [""],
      comment: [""],
      // packageName: [""],
      // roomCategory: [""],
      // roomPrice: [""],
      // currency: [""],
      packageArray: this.fb.array([]),
    });

    this.admissionDischargeTrackerForm = this.fb.group({
      hospitalId: [""],
      hospitalName: [""],
      admissionDate: ["", [Validators.required]],
      admittedOnPlannedDate: ["", [Validators.required]],
      admittedOnPlannedDateComment: ["", [Validators.required]],
      dischargeDate: ["", [Validators.required]],
      file: [""],
    });
  }
}
