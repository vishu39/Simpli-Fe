import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FormGroupDirective } from "@angular/forms";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "app-opinion-request",
  templateUrl: "./opinion-request.component.html",
  styleUrls: ["./opinion-request.component.scss"],
})
export class OpinionRequestComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  requestData: any;
  patientData: any;
  dataForEdit: any = {};
  isLoading: boolean = false;
  panelOpenState = false;
  dataLoading: boolean = false;
  doctorsList = [{ name: "Other" }];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  isEdit: boolean = false;
  assignHospitalForm: FormGroup;
  allPendingOpinionRequest = [];

  constructor(
    private faciliatorService: FacilitatorService,
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getOpinionRequestByHospitalOpenLink();
    this.createAssignHospitalForm();
    this.getDoctorOpinionRequestByDoctorOpenLink();
  }

  createAssignHospitalForm() {
    this.assignHospitalForm = this.fb.group({
      hospitalId: [this.requestData?.hospitalId],
      hospitalName: [
        {
          value: this.requestData?.hospitalName,
          disabled: true,
        },
      ],
      doctorName: ["", [Validators.required]],
      otherDoctorName: [""],
      doctorId: [""],
      emailTo: [
        "",
        [Validators.required, Validators.pattern(regexService.emailRegex)],
      ],
    });
  }

  onClickDoctor(item: any) {
    this.assignHospitalForm.patchValue({
      doctorId: item?._id,
      doctorName: item?.name,
    });
  }

  getOpinionRequestByHospitalOpenLink() {
    this.isLoading = true;
    this.faciliatorService
      .getOpinionRequestByHospitalOpenLink()
      .subscribe((res: any) => {
        let data = res?.data;
        if (!res?.data?.opinionRequest) {
          localStorage.clear();
          this.router.navigate(["/hospital/hospital-login"]);
        }
        this.getHospitalById(data?.opinionRequest?.hospitalId);

        this.assignHospitalForm.patchValue({
          hospitalName: data?.opinionRequest?.hospitalName,
          hospitalId: data?.opinionRequest?.hospitalId,
        });
        this.patientData = data?.patient;
        this.requestData = data?.opinionRequest;
        this.isLoading = false;
      });
  }

  patchForm(data: any) {
    if (!!data) {
      this.isEdit = true;
      this.dataForEdit = data;
    } else {
      this.isEdit = false;
      this.dataForEdit = data;
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  getHospitalById(id: string) {
    this.dataLoading = true;
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        if (res?.data) {
          let newAggredation = [];
          res?.data?.accreditation?.forEach((a: any) => {
            newAggredation.push(a?.name);
          });
          this.doctorsList.push(...res?.data?.doctor);
          this.doctorFreshList = this.doctorsList;
          this.dataLoading = false;
        }
      });
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.doctorFreshList);
        this.doctorsList = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.doctorsList = filterArray;
      } else {
        this.doctorsList = this.doctorFreshList;
      }
    }, 600);
  }

  getDoctorOpinionRequestByDoctorOpenLink() {
    this.faciliatorService
      .getDoctorOpinionRequestByDoctorOpenLink()
      .subscribe((res: any) => {
        if (res?.data?.opinionRequest) {
          this.allPendingOpinionRequest = [res?.data?.opinionRequest];
          this.assignHospitalForm.controls["doctorName"].disable();
          this.assignHospitalForm.controls["emailTo"].disable();
        } else {
          this.allPendingOpinionRequest = [];
        }
      });
  }
  submit() {
    if (this.assignHospitalForm.valid) {
      const { hospitalId, doctorName, doctorId, otherDoctorName, emailTo } =
        this.assignHospitalForm?.value;

      let paylaod = {
        doctorOpinionRequest: {
          hospitalId: hospitalId,
          emailId: emailTo,
          doctorName:
            doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
          hospitalName: this.requestData?.hospitalName,
          doctorId: doctorId,
        },
        patient: this.patientData?._id,
      };
      this.faciliatorService
        .assignOpinionRequestToDoctorOpenLink(paylaod)
        .subscribe((res: any) => {
          this.formDirective.resetForm();
          this.getDoctorOpinionRequestByDoctorOpenLink();
          this.getOpinionRequestByHospitalOpenLink();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.assignHospitalForm.markAllAsTouched();
    }
  }
}
