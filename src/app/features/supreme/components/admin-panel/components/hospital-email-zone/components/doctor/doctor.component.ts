import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
@Component({
  selector: "app-doctor",
  templateUrl: "./doctor.component.html",
  styleUrls: ["./doctor.component.scss"],
})
export class DoctorComponent implements OnInit {
  @Input() hospitalId: any;

  doctorData: any = [];
  totalElementDoctor: number;
  doctorParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "doctor",
  };
  timeoutDoctor = null;
  isLoadingDoctor = false;

  selectedDoctorData: any;
  navIndex: number = 0;
  constructor(
    private sharedService: SharedService,
    private supremeService: SupremeService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.hospitalId.currentValue) {
      this.doctorParams.hospital = this.hospitalId;
      this.doctorParams.page = 1;
      this.doctorData = [];
      this.selectedDoctorData = null;
      this.navIndex = 0;
      this.getDoctorData();
    }
  }

  ngOnInit(): void {}

  onActive(obj, i) {
    this.navIndex = i;
    this.doctorData.map((obj) => {
      obj.active = false;
    });
    obj.active = true;
    this.selectedDoctorData = this.doctorData[i];
  }

  getDoctorData() {
    if (this.isLoadingDoctor) {
      return;
    }
    this.isLoadingDoctor = true;
    this.supremeService.getStaffByType(this.doctorParams).subscribe(
      (res: any) => {
        this.doctorData.push(...res.data.content);
        // console.log('this.doctorData',this.doctorData)
        this.totalElementDoctor = res.data.totalElement;
        this.doctorParams.page = this.doctorParams.page + 1;
        this.isLoadingDoctor = false;

        if (this.doctorData.length) {
          this.doctorData.map((obj) => {
            obj.active = false;
          });
          this.doctorData[this.navIndex].active = true;
          this.selectedDoctorData = this.doctorData[this.navIndex];
        } else {
          this.selectedDoctorData = null;
        }
      },
      (err) => {
        this.isLoadingDoctor = false;
      }
    );
  }
  onInfiniteScrollDoctor(): void {
    if (this.doctorData.length < this.totalElementDoctor) {
      this.getDoctorData();
    }
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      this.doctorParams.search = filterValue.trim();
      this.doctorParams.page = 1;
      this.doctorData = []; // Clear existing data when searching
      this.navIndex = 0;
      this.isLoadingDoctor = false;
      this.getDoctorData();
    }, 600);
  }
}
