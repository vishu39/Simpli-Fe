import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { EmailSentDialogComponent } from "../../../../dialog/email-sent-dialog/email-sent-dialog.component";
import FileSaver from "file-saver";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "shared-dowload-proforma",
  templateUrl: "./dowload-proforma.component.html",
  styleUrls: ["./dowload-proforma.component.scss"],
})
export class DowloadProformaComponent implements OnInit {
  @Input() patientData: any;
  request = [];
  requestEdited = [];
  panelOpenState = false;
  emailFrom: FormGroup;
  hospitalArray = [];
  proformaInvoiceArray = [];

  formatList = [];

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
    this.getOpinionFormatType();
    this.getBankDetails();
    this.getAllLanguages();
    this.getAllProformaInvoiceRequest();
    this.createForm();
    this.emailFrom.patchValue({
      targetLanguage: "en",
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.isDialogClosed?.currentValue) {
      localStorage.setItem(
        `signatorySelected`,
        this.emailFrom.get("signatory")?.value
      );
    }

    if (!!changes?.isFormChange?.previousValue) {
      if (
        changes?.isFormChange?.previousValue !==
        changes?.isFormChange?.currentValue
      ) {
        localStorage.setItem(
          `signatorySelected`,
          this.emailFrom.get("signatory")?.value
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
        let signatorySelectedItem =
          localStorage.getItem("signatorySelected") || "";
        if (!!signatorySelectedItem) {
          let findIndex = this.signatoryData?.findIndex(
            (sd: any) => sd?._id === signatorySelectedItem
          );
          if (!!findIndex && findIndex !== -1) {
            this.emailFrom.patchValue({
              signatory: signatorySelectedItem,
            });
            this.selectedSignatorySearch = [signatorySelectedItem];
          } else {
            this.emailFrom.patchValue({
              signatory: this.signatoryData[0]?._id,
            });
            this.selectedSignatorySearch = [this.signatoryData[0]?._id];
          }
        } else {
          this.emailFrom.patchValue({
            signatory: this.signatoryData[0]?._id,
          });
          this.selectedSignatorySearch = [this.signatoryData[0]?._id];
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
    this.selectedSignatorySearch = [item?._id];
  }

  getOpinionFormatType() {
    this.isDataLoading = true;
    this.sharedService.getOpinionFormatType().subscribe(
      (res: any) => {
        if (res?.data) {
          this.formatList = res?.data;
          this.emailFrom.patchValue({
            format: this.formatList[0]?.value,
          });
          this.isDataLoading = false;
        }
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  createForm() {
    this.emailFrom = this.fb.group({
      selectHospital: ["", [Validators.required]],
      hospital: [],
      sendProformaInvoice: {},
      patient: this.patientData?._id,
      format: ["", [Validators.required]],
      bankAccountId: ["", [Validators.required]],
      targetLanguage: ["", [Validators.required]],
      signatory: ["", [Validators.required]],
    });
  }

  isDataNewLoading = true;
  proformaInvoiceRequestData = [];
  getAllProformaInvoiceRequest() {
    this.isDataNewLoading = true;
    this.hospitalService
      .getAllProformaInvoiceRequest(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data) {
            this.proformaInvoiceRequestData = res?.data;
            if (this.proformaInvoiceRequestData?.length) {
              this.getAllProformaInvoiceReceived();
              this.getAllProformaInvoiceReceivedEdited();
            }
            this.isDataNewLoading = false;
          }
        },
        (err) => {
          this.isDataNewLoading = false;
        }
      );
  }

  isDataLoading = true;
  getAllProformaInvoiceReceived() {
    this.isDataLoading = true;
    this.hospitalService.getAllAddedOpinion(this.patientData?._id).subscribe(
      (res: any) => {
        // console.log(res?.data);
        if (res?.data?.length > 0) {
          let array = [];
          if (this.proformaInvoiceRequestData?.length) {
            // console.log(res?.data);

            this.proformaInvoiceRequestData?.forEach((piD: any) => {
              //   let obj = res?.data?.find(
              //     (d: any) => d?.hospitalId === piD?.hospitalId
              //   );
              //   console.log(obj);

              //   if (!!obj?.hospitalId) {
              //     array.push(obj);
              //   }
              res?.data?.forEach((res: any) => {
                if (res?.hospitalId === piD?.hospitalId) {
                  if (!!res?.hospitalId) {
                    array.push(res);
                  }
                }
              });
            });
          }
          this.request = array;
        }
        this.isDataLoading = false;
      },
      (err) => {
        this.isDataLoading = false;
      }
    );
  }

  isEditedDataLoading = false;
  getAllProformaInvoiceReceivedEdited() {
    this.isEditedDataLoading = true;
    this.hospitalService
      .getAllAddedOpinionEdited(this.patientData?._id)
      .subscribe(
        (res: any) => {
          if (res?.data?.length > 0) {
            let array = [];
            if (this.proformaInvoiceRequestData?.length) {
              this.proformaInvoiceRequestData?.forEach((piD: any) => {
                // let obj = res?.data?.find(
                //   (d: any) => d?.hospitalId === piD?.hospitalId
                // );
                // console.log(obj);
                // if (!!obj?.hospitalId) {
                //   array.push(obj);
                // }

                res?.data?.forEach((res: any) => {
                  if (res?.hospitalId === piD?.hospitalId) {
                    if (!!res?.hospitalId) {
                      array.push(res);
                    }
                  }
                });
              });
            }
            this.requestEdited = array;
          }
          this.isEditedDataLoading = false;
        },
        (err) => {
          this.isEditedDataLoading = false;
        }
      );
  }

  selectChange(e: any, item: any, isEdited: boolean) {
    let opinion = {
      _id: item?._id,
      isEdited,
    };
    this.emailFrom.patchValue({
      hospital: [item?.hospitalId],
      sendProformaInvoice: [opinion],
      selectHospital: item?._id,
    });

    // if (e.checked) {
    //   let vilObj = {
    //     _id: item?._id,
    //     isEdited,
    //   };
    //   this.proformaInvoiceArray.push(vilObj);
    //   this.hospitalArray.push(item?.hospitalId);
    //   this.emailFrom.patchValue({
    //     hospital: this.hospitalArray,
    //     sendProformaInvoice: this.proformaInvoiceArray,
    //     selectHospital: item?._id,
    //   });
    // } else {
    //   let hospitalIndex = this.hospitalArray.findIndex(
    //     (h: any) => h === item?.hospitalId
    //   );
    //   if (hospitalIndex !== -1) {
    //     this.hospitalArray.splice(hospitalIndex, 1);
    //   }
    //   let vilIndex = this.proformaInvoiceArray.findIndex(
    //     (vil: any) => vil?._id === item?._id
    //   );
    //   if (vilIndex !== -1) {
    //     this.proformaInvoiceArray.splice(vilIndex, 1);
    //   }
    //   this.emailFrom.patchValue({
    //     hospital: this.hospitalArray,
    //     sendProformaInvoice: this.proformaInvoiceArray,
    //     selectHospital: item?._id,
    //   });
    //   if (!this.proformaInvoiceArray?.length) {
    //     this.emailFrom.patchValue({
    //       selectHospital: "",
    //     });
    //   }
    // }
  }

  bankDetailsData = [];
  getBankDetails() {
    this.hospitalService.getBankDetails().subscribe((res: any) => {
      if (res?.data.length) {
        this.bankDetailsData = res?.data[0]?.bankAccount;
      }
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

  submit() {
    if (this.emailFrom.valid) {
      let values = this.emailFrom.value;
      const {
        hospital,
        sendProformaInvoice,
        patient,
        format,
        bankAccountId,
        targetLanguage,
      } = values;
      let newHospital = [...new Set(hospital)];
      let payload = {
        hospital: newHospital,
        sendOpinion: sendProformaInvoice,
        patient,
        format,
        bankAccountId,
        targetLanguage,
        signatory: this.selectedSignatorySearch,
      };

      this.hospitalService
        .downloadProformaInvoice(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          res?.data?.forEach((e: any) => {
            const uint8Array = new Uint8Array(e?.content?.data);
            let blob = new Blob([uint8Array], { type: e?.contentType });
            FileSaver.saveAs(blob, e?.filename);
          });
          localStorage.setItem(
            `signatorySelected`,
            this.emailFrom.get("signatory")?.value
          );
          this.dialogRef.close(true);
        });
    } else {
      this.emailFrom.markAllAsTouched();
    }
  }
}
