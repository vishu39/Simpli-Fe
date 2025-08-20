import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "shared-referral-partner-pre-zone",
  templateUrl: "./referral-partner-pre-zone.component.html",
  styleUrls: ["./referral-partner-pre-zone.component.scss"],
})
export class ReferralPartnerPreZoneComponent implements OnInit {
  selectReferral = {
    _id: "",
  };
  preSelect = true;
  // Referral Linking
  referralData: any = [];
  referralDataFreshList: any = [];
  totalElementReferral: number;
  referralParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutReferral = null;
  isLoadingReferral = false;

  emailContentData: any = [];
  selectedEmailContentData: any;
  navIndex: number = 0;

  selectedReferralId: string = "";

  constructor(
    private sharedService: SharedService,
    private supremeService: SupremeService
  ) {}

  ngOnInit(): void {
    this.getAllFacilitatorName();
  }
  onChangeHospital(event) {
    this.selectedReferralId = event.value;
    this.sharedService.hospitalEmailZoneSubject.next(event.value);
  }

  // Hospital linking
  getAllFacilitatorName() {
    if (this.isLoadingReferral) {
      return;
    }
    this.isLoadingReferral = true;

    this.sharedService.getAdminDetails().subscribe(
      (res: any) => {
        this.referralData = [res.data];
        this.referralDataFreshList = [res.data];
        this.referralData[0].old_id = this.referralData[0]?._id;
        this.referralData[0]._id = this.referralData[0]?.customerId;
        this.selectedReferralId = res.data.customerId;
        this.selectReferral._id = res.data._id;
        this.isLoadingReferral = false;
      },
      () => {
        this.isLoadingReferral = false;
      }
    );
  }
  onInfiniteScrollReferral(): void {
    if (this.referralData.length < this.totalElementReferral) {
      this.getAllFacilitatorName();
    }
  }

  searchReferral(filterValue: string) {
    clearTimeout(this.timeoutReferral);
    this.timeoutReferral = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.referralDataFreshList);
        this.referralData = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.referralData = filterArray;
      } else {
        this.referralData = this.referralDataFreshList;
      }
    }, 600);
  }

  selectedTab = "Zone";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
