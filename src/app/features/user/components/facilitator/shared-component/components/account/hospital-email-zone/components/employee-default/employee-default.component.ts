import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { CommonService } from "src/app/smvt-framework/services/common.service";
const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];
@Component({
  selector: "app-employee-default",
  templateUrl: "./employee-default.component.html",
  styleUrls: ["./employee-default.component.scss"],
})
export class EmployeeDefaultComponent implements OnInit {
  @Input() hospitalId: any;
  employeeData: any = [];
  totalElementEmployee: number;
  employeeParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutEmployee = null;
  isLoadingEmployee = false;

  selectedEmployeeData: any;
  navIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public svc: CommonService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.hospitalId.currentValue) {
      this.employeeParams.hospital = this.hospitalId;
      this.employeeParams.page = 1;
      this.employeeData = [];
      this.selectedEmployeeData = null;
      this.navIndex = 0;
      this.getEmployeeData();
    }
  }

  copyStaff(data) {
    this.svc.ui
      .warnDialog(
        "Are you sure you want to copy the staff ?",
        dialogButtonConfig,
        4
      )
      .subscribe((res) => {
        if (res.button.name === "YES") {
          const payload = {
            name: data.name,
            type: data.type,
            contact: data.contact,
            emailId: data.emailId,
            hospital: data.hospital,
          };
          this.facilitatorService
            .addHospitalStaff(payload)
            .subscribe((res: any) => {
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
              this.sharedService.staffEmployeeSubject.next(true);
            });
        }
      });
  }
  onActive(obj, i) {
    this.navIndex = i;
    this.employeeData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedEmployeeData = this.employeeData[i];
  }

  getEmployeeData() {
    if (this.isLoadingEmployee) {
      return;
    }
    this.isLoadingEmployee = true;
    this.facilitatorService
      .getDefaultStaffByType(this.employeeParams)
      .subscribe(
        (res: any) => {
          this.employeeData.push(...res.data.content);
          // console.log('this.employeeData',this.employeeData)
          this.totalElementEmployee = res.data.totalElement;
          this.employeeParams.page = this.employeeParams.page + 1;
          this.isLoadingEmployee = false;

          if (this.employeeData.length) {
            this.employeeData.map((obj) => {
              obj.active = false;
            });
            this.employeeData[this.navIndex].active = true;
            this.selectedEmployeeData = this.employeeData[this.navIndex];
          } else {
            this.selectedEmployeeData = null;
          }
        },
        (err) => {
          this.isLoadingEmployee = false;
        }
      );
  }
  onInfiniteScrollEmployee(): void {
    if (this.employeeData.length < this.totalElementEmployee) {
      this.getEmployeeData();
    }
  }

  searchEmployee(filterValue: string) {
    clearTimeout(this.timeoutEmployee);
    this.timeoutEmployee = setTimeout(() => {
      this.employeeParams.search = filterValue.trim();
      this.employeeParams.page = 1;
      this.employeeData = []; // Clear existing data when searching
      this.navIndex = 0;
      this.isLoadingEmployee = false;
      this.getEmployeeData();
    }, 600);
  }
}
