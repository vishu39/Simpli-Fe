import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-zone-dialog",
  templateUrl: "./zone-dialog.component.html",
  styleUrls: ["./zone-dialog.component.scss"],
})
export class ZoneDialogComponent implements OnInit {
  zoneForm: FormGroup;
  zoneData: any;
  hospitalId: string;
  dialogTitle: string;
  // Country Linking
  countryData: any = [];
  totalElementCountry: number;
  countryParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutCountry = null;
  isLoadingCountry = false;
  isLoadingCountrySelectAll = false;
  selectedCountrySearch: any = [];
  // Treatment Linking

  treatmentData: any = [];
  totalElementTreatment: number;
  treatmentParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutTreatment = null;
  isLoadingTreatment = false;
  isLoadingTreatmentSelectAll = false;
  selectedTreatmentSearch: any = [];
  // QueryTo Linking
  queryToData: any = [];
  totalElementQueryTo: number;
  queryToParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutQueryTo = null;
  isLoadingQueryTo = false;
  isLoadingQueryToSelectAll = false;
  selectedQueryToSearch: any = [];

  // QueryCc Linking
  queryCcData: any = [];
  totalElementQueryCc: number;
  queryCcParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutQueryCc = null;
  isLoadingQueryCc = false;
  isLoadingQueryCcSelectAll = false;
  selectedQueryCcSearch: any = [];

  // VilTo Linking
  vilToData: any = [];
  totalElementVilTo: number;
  vilToParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutVilTo = null;
  isLoadingVilTo = false;
  isLoadingVilToSelectAll = false;
  selectedVilToSearch: any = [];

  // VilCc Linking
  vilCcData: any = [];
  totalElementVilCc: number;
  vilCcParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutVilCc = null;
  isLoadingVilCc = false;
  isLoadingVilCcSelectAll = false;
  selectedVilCcSearch: any = [];

  // ConfirmationTo Linking
  confirmationToData: any = [];
  totalElementConfirmationTo: number;
  confirmationToParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutConfirmationTo = null;
  isLoadingConfirmationTo = false;
  isLoadingConfirmationToSelectAll = false;
  selectedConfirmationToSearch: any = [];

  // ConfirmationCc Linking
  confirmationCcData: any = [];
  totalElementConfirmationCc: number;
  confirmationCcParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutConfirmationCc = null;
  isLoadingConfirmationCc = false;
  isLoadingConfirmationCcSelectAll = false;
  selectedConfirmationCcSearch: any = [];

  // DoctorTo Linking
  doctorToData: any = [];
  totalElementDoctorTo: number;
  doctorToParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "doctor",
  };
  timeoutDoctorTo = null;
  isLoadingDoctorTo = false;
  isLoadingDoctorToSelectAll = false;
  selectedDoctorToSearch: any = [];

  // DoctorCc Linking
  doctorCcData: any = [];
  totalElementDoctorCc: number;
  doctorCcParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "doctor",
  };
  timeoutDoctorCc = null;
  isLoadingDoctorCc = false;
  isLoadingDoctorCcSelectAll = false;
  selectedDoctorCcSearch: any = [];

  // QueryMessage Linking
  queryMessageData: any = [];
  totalElementQueryMessage: number;
  queryMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutQueryMessage = null;
  isLoadingQueryMessage = false;
  isLoadingQueryMessageSelectAll = false;
  selectedQueryMessageSearch: any = [];

  // VilMessage Linking
  vilMessageData: any = [];
  totalElementVilMessage: number;
  vilMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutVilMessage = null;
  isLoadingVilMessage = false;
  isLoadingVilMessageSelectAll = false;
  selectedVilMessageSearch: any = [];

  // ConfirmationMessage Linking
  confirmationMessageData: any = [];
  totalElementConfirmationMessage: number;
  confirmationMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    hospital: "",
    type: "employee",
  };
  timeoutConfirmationMessage = null;
  isLoadingConfirmationMessage = false;
  isLoadingConfirmationMessageSelectAll = false;
  selectedConfirmationMessageSearch: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<ZoneDialogComponent>
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    this.queryToParams.hospital = this.hospitalId;
    this.queryCcParams.hospital = this.hospitalId;

    this.vilToParams.hospital = this.hospitalId;
    this.vilCcParams.hospital = this.hospitalId;

    this.confirmationToParams.hospital = this.hospitalId;
    this.confirmationCcParams.hospital = this.hospitalId;

    this.doctorToParams.hospital = this.hospitalId;
    this.doctorCcParams.hospital = this.hospitalId;

    this.queryMessageParams.hospital = this.hospitalId;
    this.vilMessageParams.hospital = this.hospitalId;
    this.confirmationMessageParams.hospital = this.hospitalId;

    this.getQueryToData(false);
    this.getQueryCcData(false);
    this.getVilToData(false);
    this.getVilCcData(false);
    this.getConfirmationToData(false);
    this.getConfirmationCcData(false);
    this.getDoctorToData(false);
    this.getDoctorCcData(false);
    this.getCountryData(false);
    this.getTreatmentData(false);
    this.getQueryMessageData(false);
    this.getVilMessageData(false);
    this.getConfirmationMessageData(false);
  }
  buildForm() {
    this.zoneForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      treatment: [[], [Validators.required]],
      country: [[], [Validators.required]],
      queryTo: [[], [Validators.required]],
      queryCc: [],
      vilTo: [[], [Validators.required]],
      vilCc: [],
      confirmationTo: [[], [Validators.required]],
      confirmationCc: [],
      doctorTo: [],
      doctorCc: [],
      queryMessage: [[], [Validators.required]],
      vilMessage: [[], [Validators.required]],
      confirmationMessage: [[], [Validators.required]],
    });
  }

  mapIdArray(array: any) {
    let modifiedArray = [];
    if (array?.length > 0) {
      array.forEach((a: any) => {
        modifiedArray.push(a?._id);
      });
    }
    return modifiedArray;
  }

  modifyData(array: any) {
    let modifiedArray = [];
    if (array?.length > 0) {
      array.forEach((a: any) => {
        modifiedArray.push({
          _id: a?._id,
          name: a?.name,
        });
      });
    }
    return modifiedArray;
  }

  formSubmit() {
    if (this.zoneForm.valid) {
      this.zoneForm.value.hospitalId = this.hospitalId;
      let values = this.zoneForm.value;
      let newData = {
        name: values?.name,
        country: values?.country,
        treatment: values?.treatment,
        hospitalId: this.hospitalId,
        queryTo: this.mapIdArray(values?.queryTo),
        queryCc: this.mapIdArray(values?.queryCc),
        vilTo: this.mapIdArray(values?.vilTo),
        vilCc: this.mapIdArray(values?.vilCc),
        confirmationTo: this.mapIdArray(values?.confirmationTo),
        confirmationCc: this.mapIdArray(values?.confirmationCc),
        doctorTo: this.mapIdArray(values?.doctorTo),
        doctorCc: this.mapIdArray(values?.doctorCc),
        queryMessage: this.mapIdArray(values?.queryMessage),
        vilMessage: this.mapIdArray(values?.vilMessage),
        confirmationMessage: this.mapIdArray(values?.confirmationMessage),
      };

      if (!this.zoneData) {
        this.facilitatorService
          .addHospitalEmailZone(newData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      } else {
        this.facilitatorService
          .editHospitalEmailZone(this.zoneData._id, newData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.zoneForm.controls).forEach((key) => {
        this.zoneForm.controls[key].markAsTouched();
      });
    }
  }

  getCountryData(selectAll: Boolean) {
    if (this.isLoadingCountry) {
      return;
    }
    this.isLoadingCountry = true;

    this.sharedService
      .getCmsData("getAllCountry", this.countryParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.countryData = [];
        }

        this.countryData.push(...res.data.content);
        this.totalElementCountry = res.data.totalElement;
        this.countryParams.page = this.countryParams.page + 1;
        this.isLoadingCountry = false;
        if (selectAll) {
          const allCountryNames = this.countryData.map((item) => item.name);
          allCountryNames.forEach(
            (country) =>
              this.selectedCountrySearch.includes(country) ||
              this.selectedCountrySearch.push(country)
          );
          this.zoneForm.patchValue({
            country: this.selectedCountrySearch,
          });
          this.isLoadingCountrySelectAll = false;
        }
      });
  }
  onInfiniteScrollCountry(): void {
    if (this.countryData.length < this.totalElementCountry) {
      this.getCountryData(false);
    }
  }

  searchCountry(filterValue: string) {
    clearTimeout(this.timeoutCountry);
    this.timeoutCountry = setTimeout(() => {
      this.countryParams.search = filterValue.trim();
      this.countryParams.page = 1;
      this.countryParams.limit = 20;
      this.countryData = []; // Clear existing data when searching
      this.isLoadingCountry = false;
      this.getCountryData(false);
    }, 600);
  }

  onClickCountry(item) {
    const index = this.selectedCountrySearch.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCountrySearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCountrySearch.push(item);
    }
    this.zoneForm.patchValue({
      country: [...new Set(this.selectedCountrySearch)],
    });
  }
  selectAllCountry(event) {
    if (event.checked) {
      this.countryParams.page = 1;
      this.countryParams.limit = 0;
      this.isLoadingCountry = false;
      this.isLoadingCountrySelectAll = true;
      this.getCountryData(true);
    } else {
      this.selectedCountrySearch = [];
      this.zoneForm.patchValue({
        country: [],
      });
    }
  }

  getTreatmentData(selectAll: Boolean) {
    if (this.isLoadingTreatment) {
      return;
    }
    this.isLoadingTreatment = true;

    this.sharedService
      .getCmsData("getAllTreatment", this.treatmentParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.treatmentData = [];
        }
        this.treatmentData.push(...res.data.content);
        this.totalElementTreatment = res.data.totalElement;
        this.treatmentParams.page = this.treatmentParams.page + 1;
        this.isLoadingTreatment = false;
        if (selectAll) {
          const allTreatmentNames = this.treatmentData.map((item) => item.name);
          allTreatmentNames.forEach(
            (treatment) =>
              this.selectedTreatmentSearch.includes(treatment) ||
              this.selectedTreatmentSearch.push(treatment)
          );
          this.zoneForm.patchValue({
            treatment: this.selectedTreatmentSearch,
          });
          this.isLoadingTreatmentSelectAll = false;
        }
      });
  }
  onInfiniteScrollTreatment(): void {
    if (this.treatmentData.length < this.totalElementTreatment) {
      this.getTreatmentData(false);
    }
  }

  searchTreatment(filterValue: string) {
    clearTimeout(this.timeoutTreatment);
    this.timeoutTreatment = setTimeout(() => {
      this.treatmentParams.search = filterValue.trim();
      this.treatmentParams.page = 1;
      this.treatmentParams.limit = 20;
      this.treatmentData = []; // Clear existing data when searching
      this.isLoadingTreatment = false;
      this.getTreatmentData(false);
    }, 600);
  }

  onClickTreatment(item) {
    const index = this.selectedTreatmentSearch.indexOf(item); // Check if the item exists in the array

    if (index !== -1) {
      // If the item exists, remove it
      this.selectedTreatmentSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedTreatmentSearch.push(item);
    }
    this.zoneForm.patchValue({
      treatment: [...new Set(this.selectedTreatmentSearch)],
    });
  }
  selectAllTreatment(event) {
    if (event.checked) {
      this.treatmentParams.page = 1;
      this.treatmentParams.limit = 0;
      this.isLoadingTreatment = false;
      this.isLoadingTreatmentSelectAll = true;
      this.getTreatmentData(true);
    } else {
      this.selectedTreatmentSearch = [];
      this.zoneForm.patchValue({
        treatment: [],
      });
    }
  }

  // QueryTo Linking

  getQueryToData(selectAll: Boolean) {
    if (this.isLoadingQueryTo) {
      return;
    }
    this.isLoadingQueryTo = true;

    this.facilitatorService
      .getStaffByType(this.queryToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryToData = [];
        }
        this.queryToData.push(...res.data.content);
        this.totalElementQueryTo = res.data.totalElement;
        this.queryToParams.page = this.queryToParams.page + 1;
        this.isLoadingQueryTo = false;
        if (selectAll) {
          const allQueryTo = this.queryToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allQueryTo.forEach((queryTo) => {
            const isQueryToAlreadySelected = this.selectedQueryToSearch.some(
              (selectedQueryTo) => selectedQueryTo._id === queryTo._id
            );

            if (!isQueryToAlreadySelected) {
              this.selectedQueryToSearch.push(queryTo);
            }
          });

          this.zoneForm.patchValue({
            queryTo: this.selectedQueryToSearch,
          });
          this.isLoadingQueryToSelectAll = false;
        }
      });
  }
  onInfiniteScrollQueryTo(): void {
    if (this.queryToData.length < this.totalElementQueryTo) {
      this.getQueryToData(false);
    }
  }

  searchQueryTo(filterValue: string) {
    clearTimeout(this.timeoutQueryTo);
    this.timeoutQueryTo = setTimeout(() => {
      this.queryToParams.search = filterValue.trim();
      this.queryToParams.page = 1;
      this.queryToParams.limit = 20;
      this.queryToData = []; // Clear existing data when searching
      this.isLoadingQueryTo = false;
      this.getQueryToData(false);
    }, 600);
  }

  onClickQueryTo(item) {
    const index = this.selectedQueryToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryToSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryTo: [...new Set(this.selectedQueryToSearch)],
    });
  }
  selectAllQueryTo(event) {
    if (event.checked) {
      this.queryToParams.page = 1;
      this.queryToParams.limit = 0;
      this.isLoadingQueryTo = false;
      this.isLoadingQueryToSelectAll = true;
      this.getQueryToData(true);
    } else {
      this.selectedQueryToSearch = [];
      this.zoneForm.patchValue({
        queryTo: [],
      });
    }
  }

  // QueryCc Linking

  getQueryCcData(selectAll: Boolean) {
    if (this.isLoadingQueryCc) {
      return;
    }
    this.isLoadingQueryCc = true;

    this.facilitatorService
      .getStaffByType(this.queryCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryCcData = [];
        }
        this.queryCcData.push(...res.data.content);
        this.totalElementQueryCc = res.data.totalElement;
        this.queryCcParams.page = this.queryCcParams.page + 1;
        this.isLoadingQueryCc = false;
        if (selectAll) {
          const allQueryCc = this.queryCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allQueryCc.forEach((queryCc) => {
            const isQueryCcAlreadySelected = this.selectedQueryCcSearch.some(
              (selectedQueryCc) => selectedQueryCc._id === queryCc._id
            );

            if (!isQueryCcAlreadySelected) {
              this.selectedQueryCcSearch.push(queryCc);
            }
          });

          this.zoneForm.patchValue({
            queryCc: this.selectedQueryCcSearch,
          });
          this.isLoadingQueryCcSelectAll = false;
        }
      });
  }
  onInfiniteScrollQueryCc(): void {
    if (this.queryCcData.length < this.totalElementQueryCc) {
      this.getQueryCcData(false);
    }
  }

  searchQueryCc(filterValue: string) {
    clearTimeout(this.timeoutQueryCc);
    this.timeoutQueryCc = setTimeout(() => {
      this.queryCcParams.search = filterValue.trim();
      this.queryCcParams.page = 1;
      this.queryCcParams.limit = 20;
      this.queryCcData = []; // Clear existing data when searching
      this.isLoadingQueryCc = false;
      this.getQueryCcData(false);
    }, 600);
  }

  onClickQueryCc(item) {
    const index = this.selectedQueryCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryCc: [...new Set(this.selectedQueryCcSearch)],
    });
  }
  selectAllQueryCc(event) {
    if (event.checked) {
      this.queryCcParams.page = 1;
      this.queryCcParams.limit = 0;
      this.isLoadingQueryCc = false;
      this.isLoadingQueryCcSelectAll = true;
      this.getQueryCcData(true);
    } else {
      this.selectedQueryCcSearch = [];
      this.zoneForm.patchValue({
        queryCc: [],
      });
    }
  }

  // VilTo Linking

  getVilToData(selectAll: Boolean) {
    if (this.isLoadingVilTo) {
      return;
    }
    this.isLoadingVilTo = true;

    this.facilitatorService
      .getStaffByType(this.vilToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.vilToData = [];
        }
        this.vilToData.push(...res.data.content);
        this.totalElementVilTo = res.data.totalElement;
        this.vilToParams.page = this.vilToParams.page + 1;
        this.isLoadingVilTo = false;
        if (selectAll) {
          const allVilTo = this.vilToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allVilTo.forEach((vilTo) => {
            const isVilToAlreadySelected = this.selectedVilToSearch.some(
              (selectedVilTo) => selectedVilTo._id === vilTo._id
            );

            if (!isVilToAlreadySelected) {
              this.selectedVilToSearch.push(vilTo);
            }
          });

          this.zoneForm.patchValue({
            vilTo: this.selectedVilToSearch,
          });
          this.isLoadingVilToSelectAll = false;
        }
      });
  }
  onInfiniteScrollVilTo(): void {
    if (this.vilToData.length < this.totalElementVilTo) {
      this.getVilToData(false);
    }
  }

  searchVilTo(filterValue: string) {
    clearTimeout(this.timeoutVilTo);
    this.timeoutVilTo = setTimeout(() => {
      this.vilToParams.search = filterValue.trim();
      this.vilToParams.page = 1;
      this.vilToParams.limit = 20;
      this.vilToData = []; // Clear existing data when searching
      this.isLoadingVilTo = false;
      this.getVilToData(false);
    }, 600);
  }

  onClickVilTo(item) {
    const index = this.selectedVilToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedVilToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedVilToSearch.push(item);
    }
    this.zoneForm.patchValue({
      vilTo: [...new Set(this.selectedVilToSearch)],
    });
  }
  selectAllVilTo(event) {
    if (event.checked) {
      this.vilToParams.page = 1;
      this.vilToParams.limit = 0;
      this.isLoadingVilTo = false;
      this.isLoadingVilToSelectAll = true;
      this.getVilToData(true);
    } else {
      this.selectedVilToSearch = [];
      this.zoneForm.patchValue({
        vilTo: [],
      });
    }
  }

  // VilCc Linking

  getVilCcData(selectAll: Boolean) {
    if (this.isLoadingVilCc) {
      return;
    }
    this.isLoadingVilCc = true;

    this.facilitatorService
      .getStaffByType(this.vilCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.vilCcData = [];
        }
        this.vilCcData.push(...res.data.content);
        this.totalElementVilCc = res.data.totalElement;
        this.vilCcParams.page = this.vilCcParams.page + 1;
        this.isLoadingVilCc = false;
        if (selectAll) {
          const allVilCc = this.vilCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allVilCc.forEach((vilCc) => {
            const isVilCcAlreadySelected = this.selectedVilCcSearch.some(
              (selectedVilCc) => selectedVilCc._id === vilCc._id
            );

            if (!isVilCcAlreadySelected) {
              this.selectedVilCcSearch.push(vilCc);
            }
          });

          this.zoneForm.patchValue({
            vilCc: this.selectedVilCcSearch,
          });
          this.isLoadingVilCcSelectAll = false;
        }
      });
  }
  onInfiniteScrollVilCc(): void {
    if (this.vilCcData.length < this.totalElementVilCc) {
      this.getVilCcData(false);
    }
  }

  searchVilCc(filterValue: string) {
    clearTimeout(this.timeoutVilCc);
    this.timeoutVilCc = setTimeout(() => {
      this.vilCcParams.search = filterValue.trim();
      this.vilCcParams.page = 1;
      this.vilCcParams.limit = 20;
      this.vilCcData = []; // Clear existing data when searching
      this.isLoadingVilCc = false;
      this.getVilCcData(false);
    }, 600);
  }

  onClickVilCc(item) {
    const index = this.selectedVilCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedVilCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedVilCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      vilCc: [...new Set(this.selectedVilCcSearch)],
    });
  }
  selectAllVilCc(event) {
    if (event.checked) {
      this.vilCcParams.page = 1;
      this.vilCcParams.limit = 0;
      this.isLoadingVilCc = false;
      this.isLoadingVilCcSelectAll = true;
      this.getVilCcData(true);
    } else {
      this.selectedVilCcSearch = [];
      this.zoneForm.patchValue({
        vilCc: [],
      });
    }
  }

  // ConfirmationTo Linking

  getConfirmationToData(selectAll: Boolean) {
    if (this.isLoadingConfirmationTo) {
      return;
    }
    this.isLoadingConfirmationTo = true;

    this.facilitatorService
      .getStaffByType(this.confirmationToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.confirmationToData = [];
        }
        this.confirmationToData.push(...res.data.content);
        this.totalElementConfirmationTo = res.data.totalElement;
        this.confirmationToParams.page = this.confirmationToParams.page + 1;
        this.isLoadingConfirmationTo = false;
        if (selectAll) {
          const allConfirmationTo = this.confirmationToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allConfirmationTo.forEach((confirmationTo) => {
            const isConfirmationToAlreadySelected =
              this.selectedConfirmationToSearch.some(
                (selectedConfirmationTo) =>
                  selectedConfirmationTo._id === confirmationTo._id
              );

            if (!isConfirmationToAlreadySelected) {
              this.selectedConfirmationToSearch.push(confirmationTo);
            }
          });

          this.zoneForm.patchValue({
            confirmationTo: this.selectedConfirmationToSearch,
          });
          this.isLoadingConfirmationToSelectAll = false;
        }
      });
  }
  onInfiniteScrollConfirmationTo(): void {
    if (this.confirmationToData.length < this.totalElementConfirmationTo) {
      this.getConfirmationToData(false);
    }
  }

  searchConfirmationTo(filterValue: string) {
    clearTimeout(this.timeoutConfirmationTo);
    this.timeoutConfirmationTo = setTimeout(() => {
      this.confirmationToParams.search = filterValue.trim();
      this.confirmationToParams.page = 1;
      this.confirmationToParams.limit = 20;
      this.confirmationToData = []; // Clear existing data when searching
      this.isLoadingConfirmationTo = false;
      this.getConfirmationToData(false);
    }, 600);
  }

  onClickConfirmationTo(item) {
    const index = this.selectedConfirmationToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedConfirmationToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedConfirmationToSearch.push(item);
    }
    this.zoneForm.patchValue({
      confirmationTo: [...new Set(this.selectedConfirmationToSearch)],
    });
  }
  selectAllConfirmationTo(event) {
    if (event.checked) {
      this.confirmationToParams.page = 1;
      this.confirmationToParams.limit = 0;
      this.isLoadingConfirmationTo = false;
      this.isLoadingConfirmationToSelectAll = true;
      this.getConfirmationToData(true);
    } else {
      this.selectedConfirmationToSearch = [];
      this.zoneForm.patchValue({
        confirmationTo: [],
      });
    }
  }

  // ConfirmationCc Linking

  getConfirmationCcData(selectAll: Boolean) {
    if (this.isLoadingConfirmationCc) {
      return;
    }
    this.isLoadingConfirmationCc = true;

    this.facilitatorService
      .getStaffByType(this.confirmationCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.confirmationCcData = [];
        }
        this.confirmationCcData.push(...res.data.content);
        this.totalElementConfirmationCc = res.data.totalElement;
        this.confirmationCcParams.page = this.confirmationCcParams.page + 1;
        this.isLoadingConfirmationCc = false;
        if (selectAll) {
          const allConfirmationCc = this.confirmationCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allConfirmationCc.forEach((confirmationCc) => {
            const isConfirmationCcAlreadySelected =
              this.selectedConfirmationCcSearch.some(
                (selectedConfirmationCc) =>
                  selectedConfirmationCc._id === confirmationCc._id
              );

            if (!isConfirmationCcAlreadySelected) {
              this.selectedConfirmationCcSearch.push(confirmationCc);
            }
          });

          this.zoneForm.patchValue({
            confirmationCc: this.selectedConfirmationCcSearch,
          });
          this.isLoadingConfirmationCcSelectAll = false;
        }
      });
  }
  onInfiniteScrollConfirmationCc(): void {
    if (this.confirmationCcData.length < this.totalElementConfirmationCc) {
      this.getConfirmationCcData(false);
    }
  }

  searchConfirmationCc(filterValue: string) {
    clearTimeout(this.timeoutConfirmationCc);
    this.timeoutConfirmationCc = setTimeout(() => {
      this.confirmationCcParams.search = filterValue.trim();
      this.confirmationCcParams.page = 1;
      this.confirmationCcParams.limit = 20;
      this.confirmationCcData = []; // Clear existing data when searching
      this.isLoadingConfirmationCc = false;
      this.getConfirmationCcData(false);
    }, 600);
  }

  onClickConfirmationCc(item) {
    const index = this.selectedConfirmationCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedConfirmationCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedConfirmationCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      confirmationCc: [...new Set(this.selectedConfirmationCcSearch)],
    });
  }
  selectAllConfirmationCc(event) {
    if (event.checked) {
      this.confirmationCcParams.page = 1;
      this.confirmationCcParams.limit = 0;
      this.isLoadingConfirmationCc = false;
      this.isLoadingConfirmationCcSelectAll = true;
      this.getConfirmationCcData(true);
    } else {
      this.selectedConfirmationCcSearch = [];
      this.zoneForm.patchValue({
        confirmationCc: [],
      });
    }
  }

  // DoctorTo Linking

  getDoctorToData(selectAll: Boolean) {
    if (this.isLoadingDoctorTo) {
      return;
    }
    this.isLoadingDoctorTo = true;

    this.facilitatorService
      .getStaffByType(this.doctorToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.doctorToData = [];
        }
        this.doctorToData.push(...res.data.content);
        this.totalElementDoctorTo = res.data.totalElement;
        this.doctorToParams.page = this.doctorToParams.page + 1;
        this.isLoadingDoctorTo = false;
        if (selectAll) {
          const allDoctorTo = this.doctorToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allDoctorTo.forEach((doctorTo) => {
            const isDoctorToAlreadySelected = this.selectedDoctorToSearch.some(
              (selectedDoctorTo) => selectedDoctorTo._id === doctorTo._id
            );

            if (!isDoctorToAlreadySelected) {
              this.selectedDoctorToSearch.push(doctorTo);
            }
          });

          this.zoneForm.patchValue({
            doctorTo: this.selectedDoctorToSearch,
          });
          this.isLoadingDoctorToSelectAll = false;
        }
      });
  }
  onInfiniteScrollDoctorTo(): void {
    if (this.doctorToData.length < this.totalElementDoctorTo) {
      this.getDoctorToData(false);
    }
  }

  searchDoctorTo(filterValue: string) {
    clearTimeout(this.timeoutDoctorTo);
    this.timeoutDoctorTo = setTimeout(() => {
      this.doctorToParams.search = filterValue.trim();
      this.doctorToParams.page = 1;
      this.doctorToParams.limit = 20;
      this.doctorToData = []; // Clear existing data when searching
      this.isLoadingDoctorTo = false;
      this.getDoctorToData(false);
    }, 600);
  }

  onClickDoctorTo(item) {
    const index = this.selectedDoctorToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDoctorToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDoctorToSearch.push(item);
    }
    this.zoneForm.patchValue({
      doctorTo: [...new Set(this.selectedDoctorToSearch)],
    });
  }
  selectAllDoctorTo(event) {
    if (event.checked) {
      this.doctorToParams.page = 1;
      this.doctorToParams.limit = 0;
      this.isLoadingDoctorTo = false;
      this.isLoadingDoctorToSelectAll = true;
      this.getDoctorToData(true);
    } else {
      this.selectedDoctorToSearch = [];
      this.zoneForm.patchValue({
        doctorTo: [],
      });
    }
  }

  // DoctorCc Linking

  getDoctorCcData(selectAll: Boolean) {
    if (this.isLoadingDoctorCc) {
      return;
    }
    this.isLoadingDoctorCc = true;

    this.facilitatorService
      .getStaffByType(this.doctorCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.doctorCcData = [];
        }
        this.doctorCcData.push(...res.data.content);
        this.totalElementDoctorCc = res.data.totalElement;
        this.doctorCcParams.page = this.doctorCcParams.page + 1;
        this.isLoadingDoctorCc = false;
        if (selectAll) {
          const allDoctorCc = this.doctorCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allDoctorCc.forEach((doctorCc) => {
            const isDoctorCcAlreadySelected = this.selectedDoctorCcSearch.some(
              (selectedDoctorCc) => selectedDoctorCc._id === doctorCc._id
            );

            if (!isDoctorCcAlreadySelected) {
              this.selectedDoctorCcSearch.push(doctorCc);
            }
          });

          this.zoneForm.patchValue({
            doctorCc: this.selectedDoctorCcSearch,
          });
          this.isLoadingDoctorCcSelectAll = false;
        }
      });
  }
  onInfiniteScrollDoctorCc(): void {
    if (this.doctorCcData.length < this.totalElementDoctorCc) {
      this.getDoctorCcData(false);
    }
  }

  searchDoctorCc(filterValue: string) {
    clearTimeout(this.timeoutDoctorCc);
    this.timeoutDoctorCc = setTimeout(() => {
      this.doctorCcParams.search = filterValue.trim();
      this.doctorCcParams.page = 1;
      this.doctorCcParams.limit = 20;
      this.doctorCcData = []; // Clear existing data when searching
      this.isLoadingDoctorCc = false;
      this.getDoctorCcData(false);
    }, 600);
  }

  onClickDoctorCc(item) {
    const index = this.selectedDoctorCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDoctorCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDoctorCcSearch.push(item);
    }
    this.zoneForm.patchValue({
      doctorCc: [...new Set(this.selectedDoctorCcSearch)],
    });
  }
  selectAllDoctorCc(event) {
    if (event.checked) {
      this.doctorCcParams.page = 1;
      this.doctorCcParams.limit = 0;
      this.isLoadingDoctorCc = false;
      this.isLoadingDoctorCcSelectAll = true;
      this.getDoctorCcData(true);
    } else {
      this.selectedDoctorCcSearch = [];
      this.zoneForm.patchValue({
        doctorCc: [],
      });
    }
  }

  // QueryMessage Linking

  getQueryMessageData(selectAll: Boolean) {
    if (this.isLoadingQueryMessage) {
      return;
    }
    this.isLoadingQueryMessage = true;

    this.facilitatorService
      .getStaffByType(this.queryMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryMessageData = [];
        }
        this.queryMessageData.push(...res.data.content);
        this.totalElementQueryMessage = res.data.totalElement;
        this.queryMessageParams.page = this.queryMessageParams.page + 1;
        this.isLoadingQueryMessage = false;
        if (selectAll) {
          const allQueryMessage = this.queryMessageData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allQueryMessage.forEach((queryMessage) => {
            const isQueryMessageAlreadySelected =
              this.selectedQueryMessageSearch.some(
                (selectedQueryMessage) =>
                  selectedQueryMessage._id === queryMessage._id
              );

            if (!isQueryMessageAlreadySelected) {
              this.selectedQueryMessageSearch.push(queryMessage);
            }
          });

          this.zoneForm.patchValue({
            queryMessage: this.selectedQueryMessageSearch,
          });
          this.isLoadingQueryMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryMessage(): void {
    if (this.queryMessageData.length < this.totalElementQueryMessage) {
      this.getQueryMessageData(false);
    }
  }

  searchQueryMessage(filterValue: string) {
    clearTimeout(this.timeoutQueryMessage);
    this.timeoutQueryMessage = setTimeout(() => {
      this.queryMessageParams.search = filterValue.trim();
      this.queryMessageParams.page = 1;
      this.queryMessageParams.limit = 20;
      this.queryMessageData = []; // Clear existing data when searching
      this.isLoadingQueryMessage = false;
      this.getQueryMessageData(false);
    }, 600);
  }

  onClickQueryMessage(item) {
    const index = this.selectedQueryMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryMessageSearch.push(item);
    }
    this.zoneForm.patchValue({
      queryMessage: [...new Set(this.selectedQueryMessageSearch)],
    });
  }

  selectAllQueryMessage(event) {
    if (event.checked) {
      this.queryMessageParams.page = 1;
      this.queryMessageParams.limit = 0;
      this.isLoadingQueryMessage = false;
      this.isLoadingQueryMessageSelectAll = true;
      this.getQueryMessageData(true);
    } else {
      this.selectedQueryMessageSearch = [];
      this.zoneForm.patchValue({
        queryMessage: [],
      });
    }
  }

  // VilMessage Linking

  getVilMessageData(selectAll: Boolean) {
    if (this.isLoadingVilMessage) {
      return;
    }
    this.isLoadingVilMessage = true;

    this.facilitatorService
      .getStaffByType(this.vilMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.vilMessageData = [];
        }
        this.vilMessageData.push(...res.data.content);
        this.totalElementVilMessage = res.data.totalElement;
        this.vilMessageParams.page = this.vilMessageParams.page + 1;
        this.isLoadingVilMessage = false;
        if (selectAll) {
          const allVilMessage = this.vilMessageData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allVilMessage.forEach((vilMessage) => {
            const isVilMessageAlreadySelected =
              this.selectedVilMessageSearch.some(
                (selectedVilMessage) =>
                  selectedVilMessage._id === vilMessage._id
              );

            if (!isVilMessageAlreadySelected) {
              this.selectedVilMessageSearch.push(vilMessage);
            }
          });

          this.zoneForm.patchValue({
            vilMessage: this.selectedVilMessageSearch,
          });
          this.isLoadingVilMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollVilMessage(): void {
    if (this.vilMessageData.length < this.totalElementVilMessage) {
      this.getVilMessageData(false);
    }
  }

  searchVilMessage(filterValue: string) {
    clearTimeout(this.timeoutVilMessage);
    this.timeoutVilMessage = setTimeout(() => {
      this.vilMessageParams.search = filterValue.trim();
      this.vilMessageParams.page = 1;
      this.vilMessageParams.limit = 20;
      this.vilMessageData = []; // Clear existing data when searching
      this.isLoadingVilMessage = false;
      this.getVilMessageData(false);
    }, 600);
  }

  onClickVilMessage(item) {
    const index = this.selectedVilMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedVilMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedVilMessageSearch.push(item);
    }
    this.zoneForm.patchValue({
      vilMessage: [...new Set(this.selectedVilMessageSearch)],
    });
  }

  selectAllVilMessage(event) {
    if (event.checked) {
      this.vilMessageParams.page = 1;
      this.vilMessageParams.limit = 0;
      this.isLoadingVilMessage = false;
      this.isLoadingVilMessageSelectAll = true;
      this.getVilMessageData(true);
    } else {
      this.selectedVilMessageSearch = [];
      this.zoneForm.patchValue({
        vilMessage: [],
      });
    }
  }

  // ConfirmationMessage Linking

  getConfirmationMessageData(selectAll: Boolean) {
    if (this.isLoadingConfirmationMessage) {
      return;
    }
    this.isLoadingConfirmationMessage = true;

    this.facilitatorService
      .getStaffByType(this.confirmationMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.confirmationMessageData = [];
        }
        this.confirmationMessageData.push(...res.data.content);
        this.totalElementConfirmationMessage = res.data.totalElement;
        this.confirmationMessageParams.page =
          this.confirmationMessageParams.page + 1;
        this.isLoadingConfirmationMessage = false;
        if (selectAll) {
          const allConfirmationMessage = this.confirmationMessageData.map(
            (item) => ({
              _id: item._id,
              name: item.name,
            })
          );
          allConfirmationMessage.forEach((confirmationMessage) => {
            const isConfirmationMessageAlreadySelected =
              this.selectedConfirmationMessageSearch.some(
                (selectedConfirmationMessage) =>
                  selectedConfirmationMessage._id === confirmationMessage._id
              );

            if (!isConfirmationMessageAlreadySelected) {
              this.selectedConfirmationMessageSearch.push(confirmationMessage);
            }
          });

          this.zoneForm.patchValue({
            confirmationMessage: this.selectedConfirmationMessageSearch,
          });
          this.isLoadingConfirmationMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollConfirmationMessage(): void {
    if (
      this.confirmationMessageData.length < this.totalElementConfirmationMessage
    ) {
      this.getConfirmationMessageData(false);
    }
  }

  searchConfirmationMessage(filterValue: string) {
    clearTimeout(this.timeoutConfirmationMessage);
    this.timeoutConfirmationMessage = setTimeout(() => {
      this.confirmationMessageParams.search = filterValue.trim();
      this.confirmationMessageParams.page = 1;
      this.confirmationMessageParams.limit = 20;
      this.confirmationMessageData = []; // Clear existing data when searching
      this.isLoadingConfirmationMessage = false;
      this.getConfirmationMessageData(false);
    }, 600);
  }

  onClickConfirmationMessage(item) {
    const index = this.selectedConfirmationMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedConfirmationMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedConfirmationMessageSearch.push(item);
    }
    this.zoneForm.patchValue({
      confirmationMessage: [...new Set(this.selectedConfirmationMessageSearch)],
    });
  }

  selectAllConfirmationMessage(event) {
    if (event.checked) {
      this.confirmationMessageParams.page = 1;
      this.confirmationMessageParams.limit = 0;
      this.isLoadingConfirmationMessage = false;
      this.isLoadingConfirmationMessageSelectAll = true;
      this.getConfirmationMessageData(true);
    } else {
      this.selectedConfirmationMessageSearch = [];
      this.zoneForm.patchValue({
        confirmationMessage: [],
      });
    }
  }

  onEdit(data) {
    this.zoneData = data;

    this.selectedCountrySearch = this.zoneData?.country;
    this.selectedTreatmentSearch = this.zoneData?.treatment;

    this.selectedQueryToSearch = this.zoneData?.queryTo;
    this.selectedQueryCcSearch = this.zoneData?.queryCc;

    this.selectedVilToSearch = this.zoneData?.vilTo;
    this.selectedVilCcSearch = this.zoneData?.vilCc;

    this.selectedConfirmationToSearch = this.zoneData?.confirmationTo;
    this.selectedConfirmationCcSearch = this.zoneData?.confirmationCc;

    this.selectedDoctorToSearch = this.zoneData?.doctorTo;
    this.selectedDoctorCcSearch = this.zoneData?.doctorCc;

    this.selectedQueryMessageSearch = this.zoneData?.queryMessage;
    this.selectedVilMessageSearch = this.zoneData?.vilMessage;
    this.selectedConfirmationMessageSearch = this.zoneData?.confirmationMessage;

    this.zoneForm.patchValue({
      name: this.zoneData.name,
      country: this.selectedCountrySearch,
      treatment: this.selectedTreatmentSearch,
      queryTo: this.modifyData(this.selectedQueryToSearch),
      queryCc: this.modifyData(this.selectedQueryCcSearch),
      vilTo: this.modifyData(this.selectedVilToSearch),
      vilCc: this.modifyData(this.selectedVilCcSearch),
      confirmationTo: this.modifyData(this.selectedConfirmationToSearch),
      confirmationCc: this.modifyData(this.selectedConfirmationCcSearch),
      doctorTo: this.modifyData(this.selectedDoctorToSearch),
      doctorCc: this.modifyData(this.selectedDoctorCcSearch),
      queryMessage: this.modifyData(this.selectedQueryMessageSearch),
      vilMessage: this.modifyData(this.selectedVilMessageSearch),
      confirmationMessage: this.modifyData(
        this.selectedConfirmationMessageSearch
      ),
    });
  }
  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }
}
