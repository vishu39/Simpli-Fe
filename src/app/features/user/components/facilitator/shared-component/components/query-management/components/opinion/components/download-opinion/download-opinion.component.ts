import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import FileSaver from "file-saver";

@Component({
  selector: "shared-download-opinion",
  templateUrl: "./download-opinion.component.html",
  styleUrls: ["./download-opinion.component.scss"],
})
export class DownloadOpinionComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  opinionArray = [];

  formatList = [
    {
      title: "Format 1 - Only Medical Comparison",
      value: "format1",
    },
    {
      title: "Format 2 - Details with Other information ",
      value: "format2",
    },
  ];
  // Language Linking
  totalElementLanguage: number;
  timeoutLanguage = null;
  isLoadingLanguage = false;
  languageList = [];
  languageParams = {
    page: 1,
    limit: 0,
    search: "",
  };

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>
  ) {}

  ngOnInit(): void {
    this.getAllLanguages();
    this.getAllOpinionReceived();
    this.getAllOpinionReceivedEdited();
    this.createForm();
    this.emailFrom.patchValue({
      targetLanguage: "en",
      format: "format1",
    });
  }
  getAllLanguages() {
    if (this.isLoadingLanguage) {
      return;
    }
    this.isLoadingLanguage = true;

    this.sharedService
      .getCmsData("getAllLanguage", this.languageParams)
      .subscribe((res: any) => {
        this.languageList.push(...res.data.content);
        this.totalElementLanguage = res.data.totalElement;
        this.languageParams.page = this.languageParams.page + 1;
        this.isLoadingLanguage = false;
      });
  }
  onInfiniteScrollLanguage(): void {
    if (this.languageList.length < this.totalElementLanguage) {
      this.getAllLanguages();
    }
  }

  searchLanguage(filterValue: string) {
    clearTimeout(this.timeoutLanguage);
    this.timeoutLanguage = setTimeout(() => {
      this.languageParams.search = filterValue.trim();
      this.languageParams.page = 1;
      this.languageList = []; // Clear existing data when searching
      this.isLoadingLanguage = false;
      this.getAllLanguages();
    }, 600);
  }

  createForm() {
    this.emailFrom = this.fb.group({
      selectHospital: ["", [Validators.required]],
      hospital: [],
      targetLanguage: [null, [Validators.required]],
      format: ["", [Validators.required]],
      sendOpinion: {},
      patient: this.patientData?._id,
    });
  }

  isDataLoading = true;
  getAllOpinionReceived() {
    this.isDataLoading = true;
    this.faciliatorService
      .getAllOpinionReceived(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.request = res?.data;
            this.isDataLoading = false;
          }
        },
        (err) => {
          this.isDataLoading = false;
        }
      );
  }

  isEditedDataLoading = true;
  getAllOpinionReceivedEdited() {
    this.isEditedDataLoading = true;
    this.faciliatorService
      .getAllOpinionReceivedEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.requestEdited = res?.data;
            this.isEditedDataLoading = false;
          }
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  selectChange(e: any, item: any, isEdited: boolean) {
    if (e.checked) {
      let vilObj = {
        _id: item?._id,
        isEdited,
      };
      this.opinionArray.push(vilObj);
      this.hospitalArray.push(item?.hospitalId);
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendOpinion: this.opinionArray,
        selectHospital: item?._id,
      });
    } else {
      let hospitalIndex = this.hospitalArray.findIndex(
        (h: any) => h === item?.hospitalId
      );
      if (hospitalIndex !== -1) {
        this.hospitalArray.splice(hospitalIndex, 1);
      }
      let vilIndex = this.opinionArray.findIndex(
        (vil: any) => vil?._id === item?._id
      );
      if (vilIndex !== -1) {
        this.opinionArray.splice(vilIndex, 1);
      }
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendOpinion: this.opinionArray,
        selectHospital: item?._id,
      });
      if (!this.opinionArray?.length) {
        this.emailFrom.patchValue({
          selectHospital: "",
        });
      }
    }
  }

  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const { hospital, sendOpinion, patient, targetLanguage, format } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        hospital: newHospital,
        sendOpinion,
        patient,
        targetLanguage,
        format,
      };
      this.faciliatorService.downloadOpinion(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        res?.data?.forEach((e: any) => {
          const uint8Array = new Uint8Array(e?.content?.data);
          let blob = new Blob([uint8Array], { type: e?.contentType });
          FileSaver.saveAs(blob, e?.filename);
        });
        this.dialogRef.close(true);
      });
    } else {
      this.emailFrom.markAllAsTouched();
    }
  }
}
