import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-treating-doc-recoring",
  templateUrl: "./treating-doc-recoring.component.html",
  styleUrls: ["./treating-doc-recoring.component.scss"],
})
export class TreatingDocRecoringComponent implements OnInit {
  @Input() patientData: any;
  constructor(private hospitalService: HospitalService) {}

  ngOnInit(): void {
    // this.getDoctorRecordingByHospitalOpenLink();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.patientData.currentValue) {
      this.getDoctorRecordingByHospitalOpenLink();
    }
  }

  recordingData: any = [];
  isDataLoading = true;
  getDoctorRecordingByHospitalOpenLink() {
    this.isDataLoading = true;
    this.hospitalService.getDoctorRecordingByHospitalOpenLink().subscribe(
      (res: any) => {
        if (!!res?.data) {
          this.recordingData = res?.data;
        }
        this.isDataLoading = false;
      },
      () => {
        this.isDataLoading = false;
      }
    );
  }
}
