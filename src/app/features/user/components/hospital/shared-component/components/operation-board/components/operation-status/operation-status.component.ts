import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "shared-operation-status",
  templateUrl: "./operation-status.component.html",
  styleUrls: ["./operation-status.component.scss"],
})
export class OperationStatusComponent implements OnInit {
  @Input() querryData: any;
  @Input() title: string;
  operationStatusForm: FormGroup;

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.operationStatusParams.type =
      this.title === "Upcoming Arrival" || this.title === "On Ground Patient"
        ? "Daily Status"
        : "Query Status";
    this.operationStatusForm = this.fb.group({
      message: ["", [Validators.required]],
      type: ["", [Validators.required]],
    });
    if (
      this.title === "Upcoming Arrival" ||
      this.title === "On Ground Patient"
    ) {
      this.operationStatusForm.patchValue({
        type: "Daily Status",
      });
    } else {
      this.operationStatusForm.patchValue({
        type: "Query Status",
      });
    }
    this.getPatientOperationStatus();
  }

  onTypeChange(val: string) {
    this.scrollCalled = false;
    this.operationStatusData = [];
    this.operationStatusParams.page = 1;
    this.operationStatusParams.type = val;
    this.getPatientOperationStatus();
  }

  operationStatusParams = {
    page: 1,
    limit: 10,
    search: "",
    type: "",
  };

  totalOperationElement = 0;
  timeoutOperationStatus = null;
  isOperationStatusLoading = false;
  operationStatusData = [];

  isDark() {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
      return true;
    } else {
      return false;
    }
  }

  getPatientOperationStatus() {
    this.isOperationStatusLoading = true;
    this.hospitalService
      .getPatientOperationStatus(
        this.querryData?._id,
        this.operationStatusParams
      )
      .subscribe(
        (res: any) => {
          let data = res?.data;
          let chats = cloneDeep(data?.content);
          this.totalOperationElement = data?.totalElement;
          let newArray = [];
          newArray.unshift(...chats);
          let reverseArray = newArray.reverse();
          this.operationStatusData.unshift(...reverseArray);
          this.operationStatusParams.page = this.operationStatusParams.page + 1;
          this.isOperationStatusLoading = false;
          if (!this.scrollCalled) {
            this.scrollToBottom();
          }
          if (!this.scrollMidCalled && this.scrollCalled) {
            this.scrollToMid();
          }
        },
        (err) => {
          this.isOperationStatusLoading = false;
        }
      );
  }

  @ViewChild("scrollMe") private myScrollContainer: ElementRef;

  scrollCalled: boolean = false;
  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
        this.scrollCalled = true;
      } catch (err) {}
    }, 100);
  }

  scrollMidCalled: boolean = false;
  scrollToMid(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight /
          this.operationStatusParams.page;
        this.scrollMidCalled = true;
      } catch (err) {}
    }, 100);
  }

  onInfiniteScrollStatus(): void {
    if (!this.isOperationStatusLoading) {
      if (this.operationStatusData.length < this.totalOperationElement) {
        this.scrollMidCalled = false;
        this.getPatientOperationStatus();
      }
    }
  }

  searchStatus(filterValue: string) {
    clearTimeout(this.timeoutOperationStatus);
    this.timeoutOperationStatus = setTimeout(() => {
      this.operationStatusParams.search = filterValue.trim();
      this.operationStatusParams.page = 1;
      this.operationStatusData = []; // Clear existing data when searching
      this.isOperationStatusLoading = false;
      this.scrollCalled = false;
      this.getPatientOperationStatus();
    }, 600);
  }

  onSubmit() {
    if (this.operationStatusForm.valid) {
      let payload = this.operationStatusForm.value;
      this.hospitalService
        .addPatientOperationStatus(this.querryData?._id, payload)
        .subscribe((res: any) => {
          if (this.title === "On Ground Patient") {
            if (this.operationStatusForm.get("type").value === "Daily Status") {
              this.querryData.statusAdded = true;
            }
          } else if (this.title === "Pending Query") {
            if (this.operationStatusForm.get("type").value === "Query Status") {
              this.querryData.statusAdded = true;
            }
          }

          if (
            this.title === "Upcoming Arrival" ||
            this.title === "On Ground Patient"
          ) {
            this.operationStatusForm.patchValue({
              type: "Daily Status",
            });
          } else {
            this.operationStatusForm.patchValue({
              type: "Query Status",
            });
          }

          this.operationStatusParams.page = 1;

          this.sharedService.showNotification("snackBar-success", res.message);
          this.getPatientOperationStatus();
          this.operationStatusForm.get("message").reset();
          this.operationStatusData = [];
          this.scrollCalled = false;
        });
    } else {
      this.operationStatusForm.markAllAsTouched();
    }
  }
}
