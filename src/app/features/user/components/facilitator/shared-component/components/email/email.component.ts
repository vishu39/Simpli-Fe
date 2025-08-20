import { Component, OnInit } from "@angular/core";

@Component({
  selector: "shared-email",
  templateUrl: "./email.component.html",
  styleUrls: ["./email.component.scss"],
})
export class EmailComponent implements OnInit {
  navigationButtonArray = [];

  constructor() {}

  ngOnInit(): void {}
}
