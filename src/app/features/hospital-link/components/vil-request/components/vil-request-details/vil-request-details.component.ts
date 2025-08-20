import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-vil-request-details",
  templateUrl: "./vil-request-details.component.html",
  styleUrls: ["./vil-request-details.component.scss"],
})
export class VilRequestDetailsComponent implements OnInit {
  @Input() requestData: any;
  @Input() patientData: any;
  requests = [];

  constructor() {}

  ngOnInit(): void {
    this.requests = [this.requestData];
  }
}
