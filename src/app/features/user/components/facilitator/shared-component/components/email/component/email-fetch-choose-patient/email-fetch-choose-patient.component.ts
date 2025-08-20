import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-email-fetch-choose-patient",
  templateUrl: "./email-fetch-choose-patient.component.html",
  styleUrls: ["./email-fetch-choose-patient.component.scss"],
})
export class EmailFetchChoosePatientComponent implements OnInit {
  @Input() emailData: any;
  @Input() choosedPatientFormControl: FormControl;

  patientList: any = [];
  totalElement: number;
  patientParams = {
    page: 1,
    limit: 20,
    search: "",
    status: "open",
  };
  uhidCode: string;
  isLoadingPatient: boolean = false;
  timeoutPatient = null;
  selectedPatient: any = {};
  isPatientSelected: any = false;

  constructor(private facilitatorService: FacilitatorService) {}

  ngOnInit(): void {
    this.isEmailDataLoading = true;
    this.getAccountDetailsAttribute();
    // this.getAllPatient();
    this.getPatientNameByEmailFetch();
  }

  @ViewChild("myInput") myInput!: ElementRef;
  newPatientData: any;
  commingEmailData: any;
  isEmailDataLoading = false;
  isAiLoading = true;
  getPatientNameByEmailFetch() {
    this.isEmailDataLoading = true;
    this.isAiLoading = true;
    this.facilitatorService
      .getPatientNameByEmailFetch(this.emailData?._id)
      .subscribe(
        (res: any) => {
          if (!!res?.data) {
            this.commingEmailData = res?.data;
            this.newPatientData = res?.data?.patientData;
            this.isAiLoading = false;
            this.myInput.nativeElement.value = this.newPatientData?.patientName;
            this.patientParams.search = this.newPatientData?.patientName;
            this.isEmailDataLoading = false;
            this.getAllPatient();
          } else {
            this.getAllPatient();
          }
        },
        () => {
          this.isEmailDataLoading = false;
          this.isAiLoading = false;
          this.getAllPatient();
        }
      );
  }

  onPatientClick(obj: any) {
    this.isPatientSelected = true;
    this.selectedPatient = obj;
  }

  getAccountDetailsAttribute() {
    this.facilitatorService
      .getAccountDetailsAttribute()
      .subscribe((res: any) => {
        this.uhidCode = res?.data?.uhidCode;
      });
  }

  getAllPatient() {
    if (this.isLoadingPatient) {
      return;
    }
    this.isLoadingPatient = true;
    this.facilitatorService.getAllPatient(this.patientParams).subscribe(
      (res: any) => {
        this.totalElement = res?.data?.totalElement;
        this.patientList.push(...res.data.content);
        this.patientParams.page = this.patientParams.page + 1;
        this.isLoadingPatient = false;
        this.isEmailDataLoading = false;
        this.isAiLoading = false;
        this.currentSelectedPatient();
      },
      (err) => {
        this.isLoadingPatient = false;
        this.isEmailDataLoading = false;
        this.isAiLoading = false;
      }
    );
  }

  currentSelectedPatient() {
    if (this.choosedPatientFormControl.value) {
      let patientId = this.choosedPatientFormControl.value;
      let patientObj = this.patientList.find(
        (patient: any) => patient?._id === patientId
      );
      this.onPatientClick(patientObj);
    }
  }

  onInfiniteScrollPatient(): void {
    if (this.patientList.length < this.totalElement) {
      this.getAllPatient();
    }
  }

  searchPatient(filterValue: string) {
    clearTimeout(this.timeoutPatient);
    this.timeoutPatient = setTimeout(() => {
      this.patientParams.search = filterValue.trim();
      this.patientParams.page = 1;
      this.patientList = [];
      this.isLoadingPatient = false;
      this.getAllPatient();
    }, 600);
  }
}
