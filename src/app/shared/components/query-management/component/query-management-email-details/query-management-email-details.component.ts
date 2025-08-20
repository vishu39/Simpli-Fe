import { Component, Input, OnInit } from "@angular/core";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "app-query-management-email-details",
  templateUrl: "./query-management-email-details.component.html",
  styleUrls: ["./query-management-email-details.component.scss"],
})
export class QueryManagementEmailDetailsComponent implements OnInit {
  @Input() emailData: any = [];
  @Input() component: string;

  loginType: string;

  queryArray = ["opinion", "opd", "proforma", "preIntimation"];

  constructor() {}

  ngOnInit(): void {
    this.loginType = GET_LOGIN_TYPE();
  }
}
