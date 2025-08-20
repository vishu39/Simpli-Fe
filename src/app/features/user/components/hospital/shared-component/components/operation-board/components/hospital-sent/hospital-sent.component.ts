import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-hospital-sent",
  templateUrl: "./hospital-sent.component.html",
  styleUrls: ["./hospital-sent.component.scss"],
})
export class HospitalSentComponent implements OnInit {
  @Input() queryData: any;
  @Input() allPatientConfirmationRequest: any;
  @Input() allVilRequest: any;
  @Input() title: string;
  isHospital: boolean = false;

  activeTab = "";

  constructor(private hospitalService: HospitalService) {}

  onTabChange(currentTab: string) {
    if (this.activeTab !== currentTab) {
      switch (currentTab) {
        case "opinion":
          this.getAllOpinionRequest();
          break;
        case "opd":
          this.getAllOpdRequest();
          break;
        case "pre":
          this.getAllPreIntimationRequest();
          break;
        case "proforma":
          this.getAllProformaInvoiceRequest();
          break;
      }
    }
    this.activeTab = currentTab;
  }

  ngOnInit(): void {
    if (
      this.title === "On Ground Patient" ||
      this.title === "Upcoming Arrival"
    ) {
      this.onTabChange("patient");
    } else {
      this.onTabChange("opinion");
    }
  }

  ngOnChanges(changes: SimpleChanges) {}

  allOpinionRequest = [];
  isOpinionLoading: boolean = false;
  getAllOpinionRequest() {
    this.isOpinionLoading = true;
    this.hospitalService
      .getAllOpinionRequest(this.queryData?._id)
      .subscribe((res: any) => {
        this.allOpinionRequest = res?.data;
        this.isOpinionLoading = false;
      });
  }

  allOpdRequest = [];
  isOpdLoading: boolean = false;
  getAllOpdRequest() {
    this.isOpdLoading = true;
    this.hospitalService
      .getAllOpdRequest(this.queryData?._id)
      .subscribe((res: any) => {
        this.allOpdRequest = res?.data;
        this.isOpdLoading = false;
      });
  }

  allPreIntemationRequest = [];
  isPreLoading: boolean = false;
  getAllPreIntimationRequest() {
    this.isPreLoading = true;
    this.hospitalService
      .getAllPreIntimation(this?.queryData?._id)
      .subscribe((res: any) => {
        this.allPreIntemationRequest = res?.data;
        this.isPreLoading = false;
      });
  }

  allProformaRequest = [];
  isProformaLoading: boolean = false;
  getAllProformaInvoiceRequest() {
    this.isProformaLoading = true;
    this.hospitalService
      .getAllProformaInvoiceRequest(this?.queryData?._id)
      .subscribe((res: any) => {
        this.allProformaRequest = res?.data;
        this.isProformaLoading = false;
      });
  }
}
