import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { AddReferralPartnerOwnStaffComponent } from "./dialog/add-referral-partner-own-staff/add-referral-partner-own-staff.component";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-shared-referral-partner-own-staff",
  templateUrl: "./shared-referral-partner-own-staff.component.html",
  styleUrls: ["./shared-referral-partner-own-staff.component.scss"],
})
export class SharedReferralPartnerOwnStaffComponent implements OnInit {
  displayedColumns: string[] = [
    "createdAt",
    "name",
    "emailId",
    "contact",
    "referral",
    "action",
  ];
  referralPartnerStaffData = new MatTableDataSource<any>([]);
  totalElement: number;
  referralPartnerStaffParams = {
    page: 1,
    limit: 10,
    search: "",
  };
  timeout = null;

  constructor(
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllReferralPartnerStaff();
  }

  addHospitalStaff(heading: string) {
    const dialogRef = this.dialog.open(AddReferralPartnerOwnStaffComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllReferralPartnerStaff();
      }
    });
  }

  editHospitalStaff(heading: string, item: any) {
    const dialogRef = this.dialog.open(AddReferralPartnerOwnStaffComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.onEdit(item);

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getAllReferralPartnerStaff();
      }
    });
  }

  isDataLoading = true;
  getAllReferralPartnerStaff() {
    this.referralPartnerStaffData.data = [];
    this.isDataLoading = true;
    this.facilitatorService
      .getAllReferralPartnerStaff(this.referralPartnerStaffParams)
      .subscribe(
        (res: any) => {
          this.referralPartnerStaffData.data = res.data.content;
          this.totalElement = res.data.totalElement;
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  onPaginateChange(value) {
    this.referralPartnerStaffParams.limit = value.pageSize;
    this.referralPartnerStaffParams.page = value.pageIndex + 1;
    this.getAllReferralPartnerStaff();
  }

  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.referralPartnerStaffParams.search = filterValue.trim();
      this.referralPartnerStaffParams.page = 1;
      this.getAllReferralPartnerStaff();
    }, 600);
  }

  concatHospital(hospital: any) {
    if (hospital.length === 0) {
      return ""; // Return an empty string for an empty array
    }

    let concatHospital = hospital[0].name; // Start with the first element
    for (let i = 1; i < hospital.length; i++) {
      concatHospital += ", " + hospital[i].name;
    }

    return concatHospital;
  }
  truncateText(text: string, wordLimit: number): string {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    const truncatedText = words.slice(0, wordLimit).join(" ");
    return truncatedText + "...";
  }

  deleteRecord(id: string) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.facilitatorService
            .deleteReferralPartnerStaff(id)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.getAllReferralPartnerStaff();
            });
        }
      });
  }
}
