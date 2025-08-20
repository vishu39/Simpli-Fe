import { Component, OnInit, Input } from "@angular/core";
import { GET_URL_BASED_ON_LOGIN_TYPE, isSupreme } from "../../routing-constant";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.sass"],
})
export class BreadcrumbComponent implements OnInit {
  @Input() title: string;
  @Input() items: any[];
  @Input() active_item: string;

  constructor() {}

  startingUrl = "";

  getUrl() {
    if (isSupreme()) {
      this.startingUrl = "/supreme/admin";
    } else {
      this.startingUrl = GET_URL_BASED_ON_LOGIN_TYPE();
    }
  }

  ngOnInit(): void {
    this.getUrl();
  }
}
