import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-doctor-opinion-received",
  templateUrl: "./doctor-opinion-received.component.html",
  styleUrls: ["./doctor-opinion-received.component.scss"],
})
export class DoctorOpinionReceivedComponent implements OnInit {
  request = [];
  requestEdited = [];
  panelOpenState = false;
  @Output("patchOpinionForm") patchOpinionForm: EventEmitter<any> =
    new EventEmitter();

  constructor(private faciliatorService: FacilitatorService) {}

  ngOnInit(): void {
    this.getDoctorOpinionReceivedByHospitalOpenLink();
  }

  isDataLoading = true;
  getDoctorOpinionReceivedByHospitalOpenLink() {
    this.isDataLoading = true;
    this.faciliatorService
      .getDoctorOpinionReceivedByHospitalOpenLink()
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.request = [res?.data];
          }
          this.isDataLoading = false;
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  openEditModal(item: any) {
    this.patchOpinionForm.emit(item);
  }
}
