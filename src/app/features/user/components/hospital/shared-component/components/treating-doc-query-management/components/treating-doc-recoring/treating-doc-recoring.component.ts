import { Component, Input, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "shared-treating-doc-recoring",
  templateUrl: "./treating-doc-recoring.component.html",
  styleUrls: ["./treating-doc-recoring.component.scss"],
})
export class TreatingDocRecoringComponent implements OnInit {
  @Input() patientData: any;
  constructor(private hospitalService: HospitalService) {}

  ngOnInit(): void {
    this.getAllRecordingByDoctor();
  }

  recordingData = [];
  isDataLoading = true;
  getAllRecordingByDoctor() {
    this.isDataLoading = true;
    this.hospitalService
      .getAllRecordingByDoctor(this.patientData?._id)
      .subscribe(
        (res: any) => {
          this.recordingData = res?.data;
          this.isDataLoading = false;
        },
        () => {
          this.isDataLoading = false;
        }
      );
  }
}
