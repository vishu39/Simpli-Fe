import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-error-log",
  templateUrl: "./error-log.component.html",
  styleUrls: ["./error-log.component.scss"],
})
export class ErrorLogComponent implements OnInit {
  errorData = [];
  navIndex: number;
  totalErrorElement: number;
  errorLoading = false;
  errorParams = {
    limit: 20,
    page: 1,
    search: "",
  };
  timeoutError = null;

  selectedError: any;

  constructor(
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.getAllError();
  }

  getAllError() {
    if (this.errorLoading) {
      return;
    }
    this.errorLoading = true;
    this.hospitalService.getErrorLogs(this.errorParams).subscribe(
      (res: any) => {
        this.errorData.push(...res?.data?.content);
        this.totalErrorElement = res?.data?.totalElement;
        this.errorParams.page = this.errorParams.page + 1;
        this.errorLoading = false;
        res?.data?.content?.map((obj) => {
          obj.active = false;
        });

        if (this.errorData?.length) {
          this.errorData[0].active = true;
          this.selectedError = this.errorData[0];
        } else {
          this.selectedError = null;
        }
      },
      (err) => {
        this.errorLoading = false;
      }
    );
  }

  onInfiniteScrollError(): void {
    if (this.errorData.length < this.totalErrorElement) {
      this.getAllError();
    }
  }

  searchError(e: any) {
    clearTimeout(this.timeoutError);
    this.timeoutError = setTimeout(() => {
      this.errorParams.search = e.target.value;
      this.errorParams.page = 1;
      this.errorData = []; // Clear existing data when searching
      this.errorLoading = false;
      this.getAllError();
    }, 600);
  }

  onActive(item: any, i: number) {
    this.navIndex = i;
    this.errorData.map((obj) => {
      obj.active = false;
    });
    item.active = true;
    this.selectedError = item;
  }
}
