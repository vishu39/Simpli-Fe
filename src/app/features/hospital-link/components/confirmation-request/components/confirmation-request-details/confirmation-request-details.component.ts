import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-confirmation-request-details",
  templateUrl: "./confirmation-request-details.component.html",
  styleUrls: ["./confirmation-request-details.component.scss"],
})
export class ConfirmationRequestDetailsComponent implements OnInit {
  @Input() requestData: any;
  @Input() patientData: any;
  requests = [];

  constructor() {}

  ngOnInit(): void {
    this.requests = [this.requestData];
  }
}
