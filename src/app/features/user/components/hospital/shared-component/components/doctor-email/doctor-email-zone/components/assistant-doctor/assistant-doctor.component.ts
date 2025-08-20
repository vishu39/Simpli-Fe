import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { doctorStaffType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-assistant-doctor",
  templateUrl: "./assistant-doctor.component.html",
  styleUrls: ["./assistant-doctor.component.scss"],
})
export class AssistantDoctorComponent implements OnInit {
  @Input() doctorId: any;
  assistantDoctorData: any = [];
  totalElementAssistantDoctor: number;
  assistantDoctorParams = {
    page: 1,
    limit: 20,
    search: "",
    doctor: "",
    type: doctorStaffType.assistantDoctor,
  };

  timeoutAssistantDoctor = null;
  isLoadingAssistantDoctor = false;

  selectedassistantDoctorData: any;
  navIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private hospitalService: HospitalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.doctorId.currentValue) {
      this.assistantDoctorParams.doctor = this.doctorId;
      this.assistantDoctorParams.page = 1;
      this.assistantDoctorData = [];
      this.selectedassistantDoctorData = null;
      this.navIndex = 0;
      this.getDoctorStaffByType();
    }
  }

  onActive(obj, i) {
    this.navIndex = i;
    this.assistantDoctorData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedassistantDoctorData = this.assistantDoctorData[i];
  }

  getDoctorStaffByType() {
    if (this.isLoadingAssistantDoctor) {
      return;
    }
    this.isLoadingAssistantDoctor = true;
    this.hospitalService
      .getDoctorStaffByType(this.assistantDoctorParams)
      .subscribe(
        (res: any) => {
          this.assistantDoctorData.push(...res.data.content);
          this.totalElementAssistantDoctor = res.data.totalElement;
          this.assistantDoctorParams.page = this.assistantDoctorParams.page + 1;
          this.isLoadingAssistantDoctor = false;

          if (this.assistantDoctorData.length) {
            this.assistantDoctorData.map((obj) => {
              obj.active = false;
            });
            this.assistantDoctorData[this.navIndex].active = true;
            this.selectedassistantDoctorData =
              this.assistantDoctorData[this.navIndex];
          } else {
            this.selectedassistantDoctorData = null;
          }
        },
        (err) => {
          this.isLoadingAssistantDoctor = false;
        }
      );
  }

  onInfiniteScrollAssistantDoctor(): void {
    if (this.assistantDoctorData.length < this.totalElementAssistantDoctor) {
      this.getDoctorStaffByType();
    }
  }

  searchAssistantDoctor(filterValue: string) {
    clearTimeout(this.timeoutAssistantDoctor);
    this.timeoutAssistantDoctor = setTimeout(() => {
      this.assistantDoctorParams.search = filterValue.trim();
      this.assistantDoctorParams.page = 1;
      this.assistantDoctorData = []; // Clear existing data when searching
      this.navIndex = 0;
      this.isLoadingAssistantDoctor = false;
      this.getDoctorStaffByType();
    }, 600);
  }
}
