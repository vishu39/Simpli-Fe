import { Component, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-shared-referral-partner-own-zone",
  templateUrl: "./shared-referral-partner-own-zone.component.html",
  styleUrls: ["./shared-referral-partner-own-zone.component.scss"],
})
export class SharedReferralPartnerOwnZoneComponent implements OnInit {
  selectReferral = {
    _id: "",
  };
  preSelect = true;
  // Referral Linking
  referralData: any = [];
  referralFreshData: any = [];
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
    private facilitatorService: FacilitatorService
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

    this.facilitatorService.getAllReferralPartner().subscribe(
      (res: any) => {
        if (!!res?.data && res?.data?.length > 0) {
          this.referralData.push(...res.data);
          this.referralFreshData.push(...res.data);
          this.selectReferral._id = res.data[0]._id;
          this.selectedReferralId = res.data[0]._id;
          this.isLoadingReferral = false;
        } else {
          this.isLoadingReferral = false;
        }
      },
      () => {
        this.isLoadingReferral = false;
      }
    );
  }

  onInfiniteScrollReferral(): void {
    // if (this.referralData.length < this.totalElementReferral) {
    //   this.getAllFacilitatorName();
    // }
  }

  searchReferral(filterValue: string) {
    clearTimeout(this.timeoutReferral);
    this.timeoutReferral = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.referralFreshData);
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
        this.referralData = this.referralFreshData;
      }
    }, 600);
  }

  selectedTab = "Zone";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
