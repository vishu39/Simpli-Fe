import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-master-add-hospital-payout",
  templateUrl: "./master-add-hospital-payout.component.html",
  styleUrls: ["./master-add-hospital-payout.component.scss"],
})
export class MasterAddHospitalPayoutComponent implements OnInit {
  @Input() selectedMasterOption: any = {};
  @Input() patientData: any = {};

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
  selectHospital = {
    _id: "",
  };
  selectedHospitalId: string = "";

  gstOption: any = ["Yes", "No"];

  revenueTypeOptions: any = [];

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog
  ) {}

  panelOpenState = true;

  selectedTab: string = "Out Patient";

  onTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.tab.textLabel;
  }

  ngOnInit(): void {
    this.getHospitalData();
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
          this.hospitalData.push(...res.data.content);
          this.selectHospital._id = this.hospitalData[0]._id;
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

  onChangeHospital(event) {
    this.selectedHospitalId = event.value;
    this.sharedService.hospitalEmailZoneSubject.next(event.value);
  }
}
