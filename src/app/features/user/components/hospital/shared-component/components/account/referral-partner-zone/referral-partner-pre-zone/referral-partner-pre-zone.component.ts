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
    this.getPreReferralPartner();
  }

  onChangeReferralPartner(event) {
    this.selectedReferralId = event.value;
    this.sharedService.hospitalEmailZoneSubject.next(event.value);
  }

  // preReferralPartner
  preReferralPartnerParams = {
    page: 1,
    limit: 10,
    search: "",
  };

  getPreReferralPartner() {
    this.sharedService
      .getAllFacilitator(this.preReferralPartnerParams)
      .subscribe(
        (res: any) => {
          if (!!res?.data?.content && res?.data?.content?.length > 0) {
            this.referralData.push(...res.data.content);
            this.selectReferral._id = this.referralData[0]._id;
            this.selectedReferralId = this.referralData[0]._id;
            this.totalElementReferral = res.data.totalElement;
            this.preReferralPartnerParams.page =
              this.preReferralPartnerParams.page + 1;
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

  onInfiniteScrollPreReferralPartner(): void {
    if (this.referralData.length < this.totalElementReferral) {
      this.getPreReferralPartner();
    }
  }

  searchPreReferralPartner(filterValue: string) {
    clearTimeout(this.timeoutReferral);
    this.timeoutReferral = setTimeout(() => {
      this.preReferralPartnerParams.search = filterValue.trim();
      this.preReferralPartnerParams.page = 1;
      this.referralData = []; // Clear existing data when searching
      this.isLoadingReferral = false;
      this.getPreReferralPartner();
    }, 600);
  }

  selectedTab = "Zone";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
