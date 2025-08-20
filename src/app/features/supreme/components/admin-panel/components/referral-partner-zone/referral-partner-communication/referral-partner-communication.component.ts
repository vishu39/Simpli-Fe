import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";

@Component({
  selector: "app-referral-partner-communication",
  templateUrl: "./referral-partner-communication.component.html",
  styleUrls: ["./referral-partner-communication.component.scss"],
})
export class ReferralPartnerCommunicationComponent implements OnInit {
  selectReferral = {
    _id: "",
  };
  preSelect = true;
  // Referral Linking
  referralData: any = [];
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

    this.supremeService.getAllFacilitatorName(this.referralParams).subscribe(
      (res: any) => {
        if (!!res?.data?.content && res?.data?.content?.length > 0) {
          // if (this.preSelect) {
          //   this.sharedService.hospitalEmailZoneSubject.next(
          //     res.data.content[0]._id
          //   );
          this.referralData.push(...res.data.content);
          this.selectReferral._id = this.referralData[0]._id;
          //   this.preSelect = false;
          // }
          this.selectedReferralId = this.referralData[0]._id;
          this.totalElementReferral = res.data.totalElement;
          this.referralParams.page = this.referralParams.page + 1;
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
    if (this.referralData.length < this.totalElementReferral) {
      this.getAllFacilitatorName();
    }
  }

  searchReferral(filterValue: string) {
    clearTimeout(this.timeoutReferral);
    this.timeoutReferral = setTimeout(() => {
      this.referralParams.search = filterValue.trim();
      this.referralParams.page = 1;
      this.referralData = []; // Clear existing data when searching
      this.isLoadingReferral = false;
      this.getAllFacilitatorName();
    }, 600);
  }

  selectedTab = "Zone";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
