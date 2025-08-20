import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { doctorStaffType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-coordinator",
  templateUrl: "./coordinator.component.html",
  styleUrls: ["./coordinator.component.scss"],
})
export class CoordinatorComponent implements OnInit {
  @Input() doctorId: any;
  coordinatorDoctorData: any = [];
  totalElementCoordinatorDoctor: number;
  coordinatorDoctorParams = {
    page: 1,
    limit: 20,
    search: "",
    doctor: "",
    type: doctorStaffType.coordinator,
  };

  timeoutCoordinatorDoctor = null;
  isLoadingCoordinatorDoctor = false;

  selectedCoordinatorDoctorData: any;
  navIndex: number = 0;
  constructor(private hospitalService: HospitalService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.doctorId.currentValue) {
      this.coordinatorDoctorParams.doctor = this.doctorId;
      this.coordinatorDoctorParams.page = 1;
      this.coordinatorDoctorData = [];
      this.selectedCoordinatorDoctorData = null;
      this.navIndex = 0;
      this.getDoctorStaffByType();
    }
  }

  onActive(obj, i) {
    this.navIndex = i;
    this.coordinatorDoctorData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedCoordinatorDoctorData = this.coordinatorDoctorData[i];
  }

  getDoctorStaffByType() {
    if (this.isLoadingCoordinatorDoctor) {
      return;
    }
    this.isLoadingCoordinatorDoctor = true;
    this.hospitalService
      .getDoctorStaffByType(this.coordinatorDoctorParams)
      .subscribe(
        (res: any) => {
          this.coordinatorDoctorData.push(...res.data.content);
          this.totalElementCoordinatorDoctor = res.data.totalElement;
          this.coordinatorDoctorParams.page =
            this.coordinatorDoctorParams.page + 1;
          this.isLoadingCoordinatorDoctor = false;

          if (this.coordinatorDoctorData.length) {
            this.coordinatorDoctorData.map((obj) => {
              obj.active = false;
            });
            this.coordinatorDoctorData[this.navIndex].active = true;
            this.selectedCoordinatorDoctorData =
              this.coordinatorDoctorData[this.navIndex];
          } else {
            this.selectedCoordinatorDoctorData = null;
          }
        },
        (err) => {
          this.isLoadingCoordinatorDoctor = false;
        }
      );
  }

  onInfiniteScrollCoordinatorDoctor(): void {
    if (
      this.coordinatorDoctorData.length < this.totalElementCoordinatorDoctor
    ) {
      this.getDoctorStaffByType();
    }
  }

  searchCoordinatorDoctor(filterValue: string) {
    clearTimeout(this.timeoutCoordinatorDoctor);
    this.timeoutCoordinatorDoctor = setTimeout(() => {
      this.coordinatorDoctorParams.search = filterValue.trim();
      this.coordinatorDoctorParams.page = 1;
      this.coordinatorDoctorData = []; // Clear existing data when searching
      this.navIndex = 0;
      this.isLoadingCoordinatorDoctor = false;
      this.getDoctorStaffByType();
    }, 600);
  }
}
