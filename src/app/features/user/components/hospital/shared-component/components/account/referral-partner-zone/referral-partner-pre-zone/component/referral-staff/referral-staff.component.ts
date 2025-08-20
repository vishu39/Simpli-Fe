import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";

@Component({
  selector: "shared-referral-staff",
  templateUrl: "./referral-staff.component.html",
  styleUrls: ["./referral-staff.component.scss"],
})
export class ReferralStaffComponent implements OnInit {
  @Input() referralId: any;

  staffData: any = [];
  totalElementStaff: number;
  staffParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutStaff = null;
  isLoadingStaff = false;

  selectedStaffData: any;
  navIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private supremeService: SupremeService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.referralId.currentValue) {
      this.staffParams.referralPartner = this.referralId;
      this.staffParams.page = 1;
      this.staffData = [];
      this.selectedStaffData = null;
      this.navIndex = 0;
      this.getStaffData();
    }
  }

  onActive(obj, i) {
    this.navIndex = i;
    this.staffData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedStaffData = this.staffData[i];
  }

  getStaffData() {
    if (this.isLoadingStaff) {
      return;
    }
    this.isLoadingStaff = true;
    this.supremeService.getStaffByReferralPartner(this.staffParams).subscribe(
      (res: any) => {
        this.staffData.push(...res.data.content);
        // console.log('this.staffData',this.staffData)
        this.totalElementStaff = res.data.totalElement;
        this.staffParams.page = this.staffParams.page + 1;
        this.isLoadingStaff = false;

        if (this.staffData.length) {
          this.staffData.map((obj) => {
            obj.active = false;
          });
          this.staffData[this.navIndex].active = true;
          this.selectedStaffData = this.staffData[this.navIndex];
        } else {
          this.selectedStaffData = null;
        }
      },
      (err) => {
        this.isLoadingStaff = false;
      }
    );
  }

  onInfiniteScrollStaff(): void {
    if (this.staffData.length < this.totalElementStaff) {
      this.getStaffData();
    }
  }

  searchStaff(filterValue: string) {
    clearTimeout(this.timeoutStaff);
    this.timeoutStaff = setTimeout(() => {
      this.staffParams.search = filterValue.trim();
      this.staffParams.page = 1;
      this.staffData = []; // Clear existing data when searching
      this.navIndex = 0;
      this.isLoadingStaff = false;
      this.getStaffData();
    }, 600);
  }
}
