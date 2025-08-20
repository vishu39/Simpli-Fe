import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import {
  GET_LOGIN_TYPE,
  GET_URL_BASED_ON_LOGIN_TYPE,
} from "src/app/shared/routing-constant";

@Component({
  selector: "app-shared-message-fetch-choose-patient",
  templateUrl: "./shared-message-fetch-choose-patient.component.html",
  styleUrls: ["./shared-message-fetch-choose-patient.component.scss"],
})
export class SharedMessageFetchChoosePatientComponent implements OnInit {
  @Input() messageData: any;
  @Input() selectedProfile: any;
  @Input() choosedPatientFormControl: FormControl;
  @Input() choosedPatientIdFormControl: FormControl;

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

  loginType = GET_LOGIN_TYPE();

  constructor(
    private hospitalService: HospitalService,
    private facilitatorService: FacilitatorService
  ) {}

  ngOnInit(): void {
    this.isEmailDataLoading = true;
    if (this.loginType === "hospital") {
      this.getAccountDetailsAttributeForHospital();
    }
    if (this.loginType === "facilitator") {
      this.getAccountDetailsAttributeForFacilitator();
    }
    this.getPatientNameByMessageFetch();
  }

  @ViewChild("myInput") myInput!: ElementRef;
  newPatientData: any;
  commingEmailData: any;
  isEmailDataLoading = false;
  isAiLoading = true;
  getPatientNameByMessageFetch() {
    this.isEmailDataLoading = true;
    this.isAiLoading = true;

    let bodyArray: any = [];
    if (this.messageData?.messageData?.length > 0) {
      this.messageData?.messageData?.forEach((md: any) => {
        if (md?.message_type === "chat" || md?.body) {
          bodyArray.push(md?.body);
        }
      });
    }

    if (this.loginType === "hospital") {
      this.getPatientNameByMessageFetchForHospital(bodyArray);
    }
    if (this.loginType === "facilitator") {
      this.getPatientNameByMessageFetchForFacilitator(bodyArray);
    }
  }

  getPatientNameByMessageFetchForHospital(bodyArray: any) {
    this.hospitalService
      .getPatientNameByMessageFetch({ message: bodyArray })
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

  getPatientNameByMessageFetchForFacilitator(bodyArray: any) {
    this.facilitatorService
      .getPatientNameByMessageFetch({ message: bodyArray })
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

  currentSelectedPatient() {
    if (this.choosedPatientFormControl.value) {
      let patientId = this.choosedPatientFormControl.value;
      let patientObj = this.patientList.find(
        (patient: any) => patient?._id === patientId
      );
      this.onPatientClick(patientObj);
    }
  }

  onPatientClick(obj: any) {
    this.isPatientSelected = true;
    this.selectedPatient = obj;
  }

  getAccountDetailsAttributeForHospital() {
    this.hospitalService.getAccountDetailsAttribute().subscribe((res: any) => {
      this.uhidCode = res?.data?.uhidCode;
    });
  }

  getAccountDetailsAttributeForFacilitator() {
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

    if (this.loginType === "hospital") {
      this.getAllPatientForHospital();
    }
    if (this.loginType === "facilitator") {
      this.getAllPatientForFacilitator();
    }
  }

  getAllPatientForHospital() {
    this.hospitalService.getAllPatient(this.patientParams).subscribe(
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

  getAllPatientForFacilitator() {
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
