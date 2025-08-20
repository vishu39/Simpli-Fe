import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { treatingDoctorUserType } from "src/app/core/models/role";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "global-shared-finance-module-toolbar",
  templateUrl: "./finance-module-toolbar.component.html",
  styleUrls: ["./finance-module-toolbar.component.scss"],
})
export class FinanceModuleToolbarComponent implements OnInit {
  timeout = null;
  @Output("toolbarEvent") toolbarEvent: EventEmitter<any> = new EventEmitter();
  @Output("searchEvent") searchEvent: EventEmitter<any> = new EventEmitter();

  constructor(private sharedService: SharedService) {}

  treatingDoctorUserType = treatingDoctorUserType;
  decodedToken: any = this.sharedService.decodeToken();

  ngOnInit(): void {}

  serchValue(text: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchEvent.emit(text);
    }, 600);
  }

  emitToolBarEvent($event: HTMLButtonElement, mode: string) {
    let data = { $event, mode };
    this.toolbarEvent.emit(data);
  }
}
