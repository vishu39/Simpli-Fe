import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { cloneDeep } from "lodash";
import * as moment from "moment";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ } from "src/app/shared/util";

@Component({
  selector: "app-message-fetch-add-opd",
  templateUrl: "./message-fetch-add-opd.component.html",
  styleUrls: ["./message-fetch-add-opd.component.scss"],
})
export class MessageFetchAddOpdComponent implements OnInit {
  @Input() messageData: any;
  @Input() emailFetchData: any;
  isLoadingRequest = false;
  opdForm: FormGroup;
  doctorsList = [];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  request: any = [];
  dataLoading: boolean = false;
  title = "";

  constructor(
    private facilitatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getPendingOpdRequest();
    this.buildForm();
    this.getAddOpdDataByMessageFetch();
    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.opdForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

  addOpdDataFromAi: any;
  addOpdObjFromAi: any;
  isAiLoading = true;
  getAddOpdDataByMessageFetch() {
    this.isAiLoading = true;
    let bodyArray: any = [];
    if (this.messageData?.messageData?.length > 0) {
      this.messageData?.messageData?.forEach((md: any) => {
        if (md?.message_type === "chat" || md?.body) {
          bodyArray.push(md?.body);
        }
      });
    }

    this.facilitatorService
      .getAddOpdDataByMessageFetch({ message: bodyArray })
      .subscribe(
        (res: any) => {
          this.addOpdDataFromAi = res?.data;
          this.addOpdObjFromAi = this.addOpdDataFromAi?.opdData;
          this.isAiLoading = false;
          this.fetchDataFromAi(this.addOpdObjFromAi);
        },
        () => {
          this.isAiLoading = false;
        }
      );
  }

  fetchDataFromAi(data: any) {
    let momentOpdObj;
    if (!!data?.opdAt) {
      let dateOpdObj = new Date(data?.opdAt);
      momentOpdObj = moment(dateOpdObj);
    }

    // let receivedAtDate = moment(this.emailFetchData?.date);

    this.opdForm.patchValue({
      opdAt: !!momentOpdObj ? moment(momentOpdObj).toISOString() : "",
      // receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
      meetingLink: data?.meetingLink || "",
      doctorName: data?.doctorName || "",
      paymentLink: data?.paymentLink || "",
      patient: this.emailFetchData?._id,
    });

    let hospitalObj: any;

    if (!!data?.hospitalName) {
      hospitalObj = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
        data?.hospitalName,
        this.request,
        "addVil"
      );
    }

    if (!!hospitalObj?.hospitalName) {
      this.onClickHospital(hospitalObj);
    }
  }

  patchFormIfEdit(data: any) {
    const {
      hospitalName,
      hospitalId,
      meetingLink,
      paymentLink,
      opdAt,
      opdId,
      doctorName,
      patient,
      receivedAt,
    } = data;
    this.getHospitalById(hospitalId);
    this.opdForm.patchValue({
      hospitalId: hospitalId,
      hospitalName: hospitalName,
      opdAt: opdAt,
      meetingLink: meetingLink,
      paymentLink: paymentLink,
      patient: this.emailFetchData?._id,
      opdId: opdId,
      receivedAt: receivedAt,
    });
  }

  patchDraft() {
    let opdDraftData: any = JSON.parse(
      localStorage.getItem(`${this.emailFetchData?._id}addOpdDraft`)
    );
    if (!!opdDraftData) {
      if (
        !!opdDraftData?.hospitalName ||
        !!opdDraftData?.hospitalId ||
        !!opdDraftData?.meetingLink ||
        !!opdDraftData?.paymentLink ||
        !!opdDraftData?.opdAt ||
        !!opdDraftData?.doctorName ||
        !!opdDraftData?.otherDoctorName ||
        !!opdDraftData?.receivedAt ||
        !!opdDraftData?.opdId
      ) {
        this.getHospitalById(opdDraftData?.hospitalId);
        this.opdForm.patchValue({
          ...opdDraftData,
        });
      }
    }

    // localStorage.removeItem(`${this.emailFetchData?._id}addOpdDraft`);
  }

  saveDraft() {
    let formValue = this.opdForm?.getRawValue();

    if (
      !!formValue?.hospitalName ||
      !!formValue?.hospitalId ||
      !!formValue?.meetingLink ||
      !!formValue?.paymentLink ||
      !!formValue?.opdAt ||
      !!formValue?.doctorName ||
      !!formValue?.otherDoctorName ||
      !!formValue?.receivedAt ||
      !!formValue?.opdId
    ) {
      let opdDraftData = {
        hospitalName: formValue?.hospitalName,
        hospitalId: formValue?.hospitalId,
        meetingLink: formValue?.meetingLink,
        paymentLink: formValue?.paymentLink,
        opdAt: formValue?.opdAt,
        doctorName: formValue?.doctorName,
        otherDoctorName: formValue?.otherDoctorName,
        opdId: formValue?.opdId,
        receivedAt: formValue?.receivedAt,
      };

      localStorage.setItem(
        `${this.emailFetchData?._id}addOpdDraft`,
        JSON.stringify(opdDraftData)
      );
    }
  }

  buildForm() {
    this.opdForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      doctorName: ["", [Validators.required]],
      otherDoctorName: [""],
      opdAt: ["", [Validators.required]],
      meetingLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      paymentLink: ["", [Validators.pattern(regexService.linkRegexPattern)]],
      opdId: ["", [Validators.required]],
      patient: [this.emailFetchData?._id, [Validators.required]],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
    });
  }

  getPendingOpdRequest() {
    this.isLoadingRequest = true;
    this.facilitatorService
      .getPendingOpdRequest(this.emailFetchData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
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
    // this.sharedService.startLoader();
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        this.doctorsList = [{ name: "Other" }];
        if (res?.data) {
          this.doctorsList.push(...res?.data?.doctor);
          this.doctorFreshList = this.doctorsList;
          this.dataLoading = false;
          if (this.doctorsList?.length > 0) {
            let doctorObj: any;

            if (!!this.addOpdObjFromAi?.doctorName) {
              doctorObj = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
                this.addOpdObjFromAi?.doctorName,
                this.doctorsList,
                "common"
              );
            }

            if (!!doctorObj?._id) {
              this.opdForm.patchValue({
                doctorId: doctorObj?._id,
                doctorName: doctorObj?.name,
              });
            }
          }
          // this.sharedService.stopLoader()
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
}
