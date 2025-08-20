import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "app-add-details-opd",
  templateUrl: "./add-details-opd.component.html",
  styleUrls: ["./add-details-opd.component.scss"],
})
export class AddDetailsOpdComponent implements OnInit {
  @Input() opdRequestData: any;
  @Input() patientData: any;
  @Output("refetch") refetch: EventEmitter<any> = new EventEmitter();
  isLoadingRequest = false;
  opdForm: FormGroup;
  doctorsList = [{ name: "Other" }];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  request: any = [];
  dataLoading: boolean = false;
  isEdit = false;
  title = "";

  constructor(
    private router: Router,
    private faciliatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.patchFormIfEdit();
  }

  patchFormIfEdit() {
    if (!!this.opdRequestData) {
      const { hospitalName, hospitalId, opdId } = this.opdRequestData;
      this.getHospitalById(hospitalId);
      this.opdForm.patchValue({
        hospitalId: hospitalId,
        hospitalName: hospitalName,
        opdId,
      });
    }
  }

  buildForm() {
    this.opdForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: [{ value: "", disabled: true }, [Validators.required]],
      doctorName: ["", [Validators.required]],
      otherDoctorName: [""],
      opdAt: ["", [Validators.required]],
      receivedAt: [""],
      meetingLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      paymentLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      opdId: ["", [Validators.required]],
      patient: [this.patientData?._id],
    });
  }

  onClickHospital(item: any) {
    this.getHospitalById(item?.hospitalId);
    this.opdForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      opdId: item?.opdId,
    });
  }

  getHospitalById(id: string) {
    this.dataLoading = true;
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        if (res?.data) {
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

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }
  submit() {
    if (this.opdForm?.valid) {
      const {
        hospitalId,
        opdAt,
        meetingLink,
        paymentLink,
        doctorName,
        opdId,
        patient,
        receivedAt,
        otherDoctorName,
      } = this.opdForm?.value;

      let paylaod = {
        opdReceived: {
          hospitalName: this.opdRequestData?.hospitalName,
          hospitalId,
          opdId,
          receivedAt,
          paymentLink,
          meetingLink,
          opdAt,
          doctorName:
            doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
        },
        patient: patient,
      };

      this.faciliatorService
        .opdReceivedOpenLink(paylaod)
        .subscribe((res: any) => {
          this.refetch.emit();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.opdForm.markAsTouched();
    }
  }
}
