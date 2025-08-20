import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-shared-hospital-email-zone",
  templateUrl: "./hospital-email-zone.component.html",
  styleUrls: ["./hospital-email-zone.component.scss"],
})
export class HospitalEmailZoneComponent implements OnInit {
  selectHospital = {
    _id: "",
  };
  preSelect = true;
  // Hospital Linking
  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutHospital = null;
  isLoadingHospital = false;

  emailContentData: any = [];
  selectedEmailContentData: any;
  navIndex: number = 0;

  selectedHospitalId: string = "";
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getHospitalData();
  }
  onChangeHospital(event) {
    this.selectedHospitalId = event.value;
    this.sharedService.hospitalEmailZoneSubject.next(event.value);
  }

  // Hospital linking
  getHospitalData() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService.getAllHospital(this.hospitalParams).subscribe(
      (res: any) => {
        if (!!res?.data?.content && res?.data?.content?.length > 0) {
          // if (this.preSelect) {
          //   this.sharedService.hospitalEmailZoneSubject.next(
          //     res.data.content[0]._id
          //   );
          this.hospitalData.push(...res.data.content);
          this.selectHospital._id = this.hospitalData[0]._id;
          //   this.preSelect = false;
          // }
          this.selectedHospitalId = this.hospitalData[0]._id;
          this.totalElementHospital = res.data.totalElement;
          this.hospitalParams.page = this.hospitalParams.page + 1;
          this.isLoadingHospital = false;
        } else {
          this.isLoadingHospital = false;
        }
      },
      () => {
        this.isLoadingHospital = false;
      }
    );
  }
  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getHospitalData();
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalData = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getHospitalData();
    }, 600);
  }

  selectedTab = "Zone";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
