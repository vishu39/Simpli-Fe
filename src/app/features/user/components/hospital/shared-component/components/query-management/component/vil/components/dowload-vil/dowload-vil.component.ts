import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import FileSaver from "file-saver";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "shared-dowload-vil",
  templateUrl: "./dowload-vil.component.html",
  styleUrls: ["./dowload-vil.component.scss"],
})
export class DowloadVilComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  vilArray = [];

  @Input() isDialogClosed: boolean = false;
  @Input() isFormChange: any = "opinion";

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EmailSentDialogComponent>
  ) {}

  ngOnInit(): void {
    this.getVilSetting();
    this.getVilFormatType();
    this.getAllVilRequest();
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isDialogClosed?.currentValue) {
      localStorage.setItem(
        `signatorySelectedMultiple`,
        JSON.stringify(this.emailFrom.get("signatory")?.value)
      );
    }

    if (!!changes?.isFormChange?.previousValue) {
      if (
        changes?.isFormChange?.previousValue !==
        changes?.isFormChange?.currentValue
      ) {
        localStorage.setItem(
          `signatorySelectedMultiple`,
          JSON.stringify(this.emailFrom.get("signatory")?.value)
        );
      }
    }
  }

  vilSettingData: any = [];
  signatoryData: any = [];
  signatoryFreshData: any = [];
  isLoadingSignatory = false;
  getVilSetting() {
    this.isLoadingSignatory = true;
    this.hospitalService.getVilSetting().subscribe((res: any) => {
      this.vilSettingData = res?.data;
      this.signatoryData = this.vilSettingData?.signatory;
      // signatory selected logic
      if (this.signatoryData?.length > 0) {
        let signatorySelectedItems =
          JSON.parse(localStorage.getItem("signatorySelectedMultiple")) || [];

        if (
          Array.isArray(signatorySelectedItems) &&
          signatorySelectedItems.length > 0
        ) {
          const validSelectedItems = signatorySelectedItems.filter(
            (selectedItem: any) =>
              this.signatoryData.some((sd: any) => sd._id === selectedItem._id)
          );

          if (validSelectedItems.length > 0) {
            this.selectedSignatorySearch = validSelectedItems;
            this.emailFrom.patchValue({
              signatory: [...this.selectedSignatorySearch],
            });
          } else {
            let zeroIndexData = this.signatoryData[0];
            this.selectedSignatorySearch = [
              {
                _id: zeroIndexData?._id,
                name: zeroIndexData?.signingAuthorityName,
              },
            ];
            this.emailFrom.patchValue({
              signatory: [...this.selectedSignatorySearch],
            });
          }
        } else {
          let zeroIndexData = this.signatoryData[0];
          this.selectedSignatorySearch = [
            {
              _id: zeroIndexData?._id,
              name: zeroIndexData?.signingAuthorityName,
            },
          ];
          this.emailFrom.patchValue({
            signatory: [...this.selectedSignatorySearch],
          });
        }
      }
      this.signatoryFreshData = this.vilSettingData?.signatory;
      this.isLoadingSignatory = false;
    });
  }

  timeout = null;
  isSearchLoading = false;
  searchSignatory(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.signatoryFreshData);
        this.signatoryData = [];
        this.isSearchLoading = true;
        let filterData = filterArray.filter((f: any) =>
          f?.signingAuthorityName
            ?.toLowerCase()
            .includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.signatoryData = filterArray;
        this.isSearchLoading = false;
      } else {
        this.signatoryData = this.signatoryFreshData;
        this.isSearchLoading = false;
      }
    }, 600);
  }

  selectedSignatorySearch: any = [];
  onClickSignatory(item: any) {
    const index = this.selectedSignatorySearch.findIndex(
      (element) => element._id === item._id
    );

    if (index !== -1) {
      // Item exists, remove it
      this.selectedSignatorySearch.splice(index, 1);
    } else {
      if (this.selectedSignatorySearch?.length < 2) {
        // Add new item
        this.selectedSignatorySearch.push({
          _id: item._id,
          name: item.signingAuthorityName,
        });
      } else {
        this.sharedService.showNotification(
          "snackBar-danger",
          "You may select up to two signatories."
        );
      }
    }

    this.emailFrom.patchValue({
      signatory: [...this.selectedSignatorySearch],
    });
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  formatList = [];
  getVilFormatType() {
    this.isDataLoading = true;
    this.sharedService.getVilFormatType().subscribe(
      (res: any) => {
        if (res?.data) {
          this.formatList = res?.data;

          if (
            this.patientData?.country === "Ethiopia" ||
            this.patientData?.country === "Nigeria" ||
            this.patientData?.country === "Bangladesh" ||
            this.patientData?.country === "Iraq"
          ) {
            if (this.patientData?.country === "Ethiopia") {
              const ethopiaIndex = this.formatList.findIndex(
                (template) => template.title.indexOf("Ethiopia") !== -1
              );
              if (ethopiaIndex !== -1) {
                this.onFormatChange(this.formatList[ethopiaIndex]?.value);
                this.emailFrom.patchValue({
                  format: this.formatList[ethopiaIndex]?.value,
                });
              } else {
                this.patchZeroIndexFormat();
              }
            } else if (this.patientData?.country === "Nigeria") {
              const nigeriaIndex = this.formatList.findIndex(
                (template) => template.title.indexOf("Nigeria") !== -1
              );
              if (nigeriaIndex !== -1) {
                this.onFormatChange(this.formatList[nigeriaIndex]?.value);
                this.emailFrom.patchValue({
                  format: this.formatList[nigeriaIndex]?.value,
                });
              } else {
                this.patchZeroIndexFormat();
              }
            } else if (this.patientData?.country === "Bangladesh") {
              const bangladeshIndex = this.formatList.findIndex(
                (template) => template.title.indexOf("Bangladesh") !== -1
              );
              if (bangladeshIndex !== -1) {
                this.onFormatChange(this.formatList[bangladeshIndex]?.value);
                this.emailFrom.patchValue({
                  format: this.formatList[bangladeshIndex]?.value,
                });
              } else {
                this.patchZeroIndexFormat();
              }
            } else if (this.patientData?.country === "Iraq") {
              const iraqIndex = this.formatList.findIndex(
                (template) => template.title.indexOf("Iraq") !== -1
              );
              if (iraqIndex !== -1) {
                this.onFormatChange(this.formatList[iraqIndex]?.value);
                this.emailFrom.patchValue({
                  format: this.formatList[iraqIndex]?.value,
                });
              } else {
                this.patchZeroIndexFormat();
              }
            } else {
              this.patchZeroIndexFormat();
            }
          } else {
            this.patchZeroIndexFormat();
          }

          this.isDataLoading = false;
        }
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  patchZeroIndexFormat() {
    this.emailFrom.patchValue({
      format: this.formatList[0]?.value,
    });
  }

  isOpinionDataLoading = false;
  opinionRequest: any;
  getAllAddedOpinion() {
    this.isOpinionDataLoading = true;
    this.hospitalService.getAllAddedOpinion(this.patientData?._id).subscribe(
      (res: any) => {
        if (res?.data) {
          this.opinionRequest = res?.data;
          this.isOpinionDataLoading = false;
        }
      },
      (err) => {
        this.isOpinionDataLoading = false;
      }
    );
  }

  isOpinionEditedDataLoading = false;
  opinionRequestEdited: any;
  getAllAddedOpinionEdited() {
    this.isOpinionEditedDataLoading = true;
    this.hospitalService
      .getAllAddedOpinionEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.opinionRequestEdited = res?.data;
            this.isOpinionEditedDataLoading = false;
          }
        },
        (err) => {
          this.isOpinionEditedDataLoading = false;
        }
      );
  }

  onFormatChange(value: any) {
    if (
      value?.toLowerCase()?.includes("ethiopia") ||
      value === "amritaCommonNigeriaVilTemplate" ||
      value === "sarvodyaCommonIraqVilTemplate" ||
      value === "asterCommonNigeriaVilTemplate" ||
      value === "nciCommonNigeriaVilTemplate"
    ) {
      this.getAllAddedOpinion();
      this.getAllAddedOpinionEdited();
    } else {
      this.opinionRequest = [];
      this.opinionRequestEdited = [];
      this.emailFrom.patchValue({
        sendOpinion: [],
      });
    }
  }

  createForm() {
    this.emailFrom = this.fb.group({
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendVil: {},
      format: ["", [Validators.required]],
      patient: this.patientData?._id,
      sendOpinion: [],
      signatory: ["", [Validators.required]],
    });
  }

  refetch() {
    this.request = [];
    this.getAllVilRequest();
  }

  isDataLoading = true;
  getAllVilRequest() {
    this.isDataLoading = true;
    this.hospitalService.getAllVilRequest(this.patientData?._id).subscribe(
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

  selectChange(e: any, item: any, isEdited: boolean) {
    if (e.checked) {
      let vilObj = {
        _id: item?._id,
        isEdited,
      };
      this.vilArray.push(vilObj);
      this.hospitalArray.push(item?.hospitalId);
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendVil: this.vilArray,
        selectHospital: item?._id,
      });
    } else {
      let hospitalIndex = this.hospitalArray.findIndex(
        (h: any) => h === item?.hospitalId
      );
      if (hospitalIndex !== -1) {
        this.hospitalArray.splice(hospitalIndex, 1);
      }
      let vilIndex = this.vilArray.findIndex(
        (vil: any) => vil?._id === item?._id
      );
      if (vilIndex !== -1) {
        this.vilArray.splice(vilIndex, 1);
      }
      this.emailFrom.patchValue({
        hospital: this.hospitalArray,
        sendVil: this.vilArray,
        selectHospital: item?._id,
      });
      if (!this.vilArray?.length) {
        this.emailFrom.patchValue({
          selectHospital: "",
        });
      }
    }
  }

  opinionSelectChange(e: any, item: any, isEdited: boolean) {
    let opinion = {
      _id: item?._id,
      isEdited,
    };
    this.emailFrom.patchValue({
      sendOpinion: [opinion],
    });
  }

  submit() {
    if (this.emailFrom.valid) {
      let newSignatoryArray = this.selectedSignatorySearch.map(
        (sss: any) => sss?._id
      );
      let values = this.emailFrom.value;
      const { hospital, sendVil, patient, format, sendOpinion } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        hospital: newHospital,
        patient,
        format,
        signatory: newSignatoryArray,
        sendOpinion,
        sendVil,
      };

      this.hospitalService.downloadVil(payload).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        res?.data?.forEach((e: any) => {
          const uint8Array = new Uint8Array(e?.content?.data);
          let blob = new Blob([uint8Array], { type: e?.contentType });
          FileSaver.saveAs(blob, e?.filename);
        });
        localStorage.setItem(
          `signatorySelectedMultiple`,
          JSON.stringify(this.emailFrom.get("signatory")?.value)
        );
        this.dialogRef.close(true);
      });
    } else {
      this.emailFrom.markAllAsTouched();
    }
  }
}
