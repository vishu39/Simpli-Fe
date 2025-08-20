import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-doctor-email-zone",
  templateUrl: "./doctor-email-zone.component.html",
  styleUrls: ["./doctor-email-zone.component.scss"],
})
export class DoctorEmailZoneComponent implements OnInit {
  selectDoctor = {
    _id: "",
  };
  preSelect = true;
  // Doctor Linking
  doctorData: any = [];
  totalElementDoctor: number;
  doctorParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutDoctor = null;
  isLoadingDoctor = false;

  emailContentData: any = [];
  selectedEmailContentData: any;
  navIndex: number = 0;

  selectedDoctorId: string = "";
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getDoctorData();
  }
  onChangeDoctor(event) {
    this.selectedDoctorId = event.value;
    this.sharedService.doctorEmailZoneSubject.next(event.value);
  }

  // Doctor linking
  getDoctorData() {
    if (this.isLoadingDoctor) {
      return;
    }
    this.isLoadingDoctor = true;

    this.sharedService.getAllDoctor(this.doctorParams).subscribe(
      (res: any) => {
        if (!!res?.data?.content && res?.data?.content?.length > 0) {
          // if (this.preSelect) {
          //   this.sharedService.doctorEmailZoneSubject.next(
          //     res.data.content[0]._id
          //   );
          this.doctorData.push(...res.data.content);
          this.selectDoctor._id = this.doctorData[0]._id;
          //   this.preSelect = false;
          // }
          this.selectedDoctorId = this.doctorData[0]._id;
          this.totalElementDoctor = res.data.totalElement;
          this.doctorParams.page = this.doctorParams.page + 1;
          this.isLoadingDoctor = false;
        } else {
          this.isLoadingDoctor = false;
        }
      },
      () => {
        this.isLoadingDoctor = false;
      }
    );
  }
  onInfiniteScrollDoctor(): void {
    if (this.doctorData.length < this.totalElementDoctor) {
      this.getDoctorData();
    }
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.doctorParams.search = filterValue.trim();
      this.doctorParams.page = 1;
      this.doctorData = []; // Clear existing data when searching
      this.isLoadingDoctor = false;
      this.getDoctorData();
    }, 600);
  }

  selectedTab = "Assistant Doctor";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
