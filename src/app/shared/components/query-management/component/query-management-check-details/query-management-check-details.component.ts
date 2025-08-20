import { Component, Input, OnInit } from "@angular/core";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "app-query-management-check-details",
  templateUrl: "./query-management-check-details.component.html",
  styleUrls: ["./query-management-check-details.component.scss"],
})
export class QueryManagementCheckDetailsComponent implements OnInit {
  @Input() messageData: any = [];
  @Input() component: string;

  loginType: string;

  queryArray = ["opinion", "opd", "proforma", "preIntimation"];

  constructor() {}

  ngOnInit(): void {
    this.loginType = GET_LOGIN_TYPE();
  }
}
