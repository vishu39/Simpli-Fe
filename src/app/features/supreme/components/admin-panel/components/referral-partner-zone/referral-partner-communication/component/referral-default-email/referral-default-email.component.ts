import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";

@Component({
  selector: "app-referral-default-email",
  templateUrl: "./referral-default-email.component.html",
  styleUrls: ["./referral-default-email.component.scss"],
})
export class ReferralDefaultEmailComponent implements OnInit {
  @Input() referralId: any;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  defaultEmailForm: FormGroup;
  defaultEmailData: any;
  // QueryTo Linking
  queryToData: any = [];
  totalElementQueryTo: number;
  queryToParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
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
    referralPartner: "",
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
    referralPartner: "",
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
    referralPartner: "",
    type: "employee",
  };
  timeoutVilCc = null;
  isLoadingVilCc = false;
  isLoadingVilCcSelectAll = false;
  selectedVilCcSearch: any = [];

  // ConfirmationTo Linking
  dailyStatusToData: any = [];
  totalElementDailyStatusTo: number;
  dailyStatusToParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutDailyStatusTo = null;
  isLoadingDailyStatusTo = false;
  isLoadingDailyStatusToSelectAll = false;
  selectedDailyStatusToSearch: any = [];

  // ConfirmationCc Linking
  dailyStatusCcData: any = [];
  totalElementDailyStatusCc: number;
  dailyStatusCcParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutDailyStatusCc = null;
  isLoadingDailyStatusCc = false;
  isLoadingDailyStatusCcSelectAll = false;
  selectedDailyStatusCcSearch: any = [];

  // DoctorTo Linking
  queryStatusToData: any = [];
  totalElementQueryStatusTo: number;
  queryStatusToParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "doctor",
  };
  timeoutDoctorTo = null;
  isLoadingQueryStatusTo = false;
  isLoadingQueryStatusToSelectAll = false;
  selectedQueryStatusToSearch: any = [];

  // DoctorCc Linking
  queryStatusCcData: any = [];
  totalElementQueryStatusCc: number;
  queryStatusCcParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "doctor",
  };
  timeoutQueryStatusCc = null;
  isLoadingQueryStatusCc = false;
  isLoadingQueryStatusCcSelectAll = false;
  selectedQueryStatusCcSearch: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private supremeService: SupremeService,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.referralId.currentValue) {
      this.getReferralPartnerDefaultEmail();

      this.queryToParams.referralPartner = this.referralId;
      this.queryToParams.page = 1;
      this.queryToData = [];
      this.getQueryToData(false);

      this.queryCcParams.referralPartner = this.referralId;
      this.queryCcParams.page = 1;
      this.queryCcData = [];
      this.getQueryCcData(false);

      this.vilToParams.referralPartner = this.referralId;
      this.vilToParams.page = 1;
      this.vilToData = [];
      this.getVilToData(false);

      this.vilCcParams.referralPartner = this.referralId;
      this.vilCcParams.page = 1;
      this.vilCcData = [];
      this.getVilCcData(false);

      this.dailyStatusToParams.referralPartner = this.referralId;
      this.dailyStatusToParams.page = 1;
      this.dailyStatusToData = [];
      this.getDailyStatusToData(false);

      this.dailyStatusCcParams.referralPartner = this.referralId;
      this.dailyStatusCcParams.page = 1;
      this.dailyStatusCcData = [];
      this.getDailyStatusCcData(false);

      this.queryStatusToParams.referralPartner = this.referralId;
      this.queryStatusToParams.page = 1;
      this.queryStatusToData = [];
      this.getQueryStatusToData(false);

      this.queryStatusCcParams.referralPartner = this.referralId;
      this.queryStatusCcParams.page = 1;
      this.queryStatusCcData = [];
      this.getQueryStatusCcData(false);

      this.defaultEmailForm.controls["queryTo"].enable();
      this.defaultEmailForm.controls["queryCc"].enable();
      this.defaultEmailForm.controls["vilTo"].enable();
      this.defaultEmailForm.controls["vilCc"].enable();
      this.defaultEmailForm.controls["dailyStatusTo"].enable();
      this.defaultEmailForm.controls["dailyStatusCc"].enable();
      this.defaultEmailForm.controls["queryStatusTo"].enable();
      this.defaultEmailForm.controls["queryStatusCc"].enable();
    }
  }

  ngOnInit(): void {
    // this.defaultEmailForm.controls["queryTo"].disable();
    // this.defaultEmailForm.controls["queryCc"].disable();
    // this.defaultEmailForm.controls["vilTo"].disable();
    // this.defaultEmailForm.controls["vilCc"].disable();
    // this.defaultEmailForm.controls["confirmationTo"].disable();
    // this.defaultEmailForm.controls["confirmationCc"].disable();
  }
  buildForm() {
    this.defaultEmailForm = this.formBuilder.group({
      queryTo: [[], [Validators.required]],
      queryCc: [],
      vilTo: [[], [Validators.required]],
      vilCc: [],
      dailyStatusTo: [[], [Validators.required]],
      dailyStatusCc: [],
      queryStatusTo: [[], [Validators.required]],
      queryStatusCc: [],
    });
  }

  getReferralPartnerDefaultEmail() {
    this.supremeService
      .getReferralPartnerDefaultEmail(this.referralId)
      .subscribe((res: any) => {
        this.defaultEmailData = res.data;
        // console.log('this.defaultEmailData', this.defaultEmailData)
        if (!this.defaultEmailData) {
          this.formDirective.resetForm(); // Reset the ugly validators
        }
        this.selectedQueryToSearch = this.defaultEmailData?.queryTo
          ? this.defaultEmailData?.queryTo
          : [];
        this.selectedQueryCcSearch = this.defaultEmailData?.queryCc
          ? this.defaultEmailData?.queryCc
          : [];
        this.selectedVilToSearch = this.defaultEmailData?.vilTo
          ? this.defaultEmailData?.vilTo
          : [];
        this.selectedVilCcSearch = this.defaultEmailData?.vilCc
          ? this.defaultEmailData?.vilCc
          : [];
        this.selectedDailyStatusToSearch = this.defaultEmailData?.dailyStatusTo
          ? this.defaultEmailData?.dailyStatusTo
          : [];
        this.selectedDailyStatusCcSearch = this.defaultEmailData?.dailyStatusCc
          ? this.defaultEmailData?.dailyStatusCc
          : [];
        this.selectedQueryStatusToSearch = this.defaultEmailData?.queryStatusTo
          ? this.defaultEmailData?.queryStatusTo
          : [];
        this.selectedQueryStatusCcSearch = this.defaultEmailData?.queryStatusCc
          ? this.defaultEmailData?.queryStatusCc
          : [];

        this.defaultEmailForm.patchValue({
          queryTo: this.modifyData(this.selectedQueryToSearch),
          queryCc: this.modifyData(this.selectedQueryCcSearch),
          vilTo: this.modifyData(this.selectedVilToSearch),
          vilCc: this.modifyData(this.selectedVilCcSearch),
          dailyStatusTo: this.modifyData(this.selectedDailyStatusToSearch),
          dailyStatusCc: this.modifyData(this.selectedDailyStatusCcSearch),
          queryStatusTo: this.modifyData(this.selectedQueryStatusToSearch),
          queryStatusCc: this.modifyData(this.selectedQueryStatusCcSearch),
        });
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
    if (this.referralId) {
      if (this.defaultEmailForm.valid) {
        this.defaultEmailForm.value.referralId = this.referralId;

        let values = this.defaultEmailForm.value;
        let newData = {
          referralPartnerId: this.referralId,
          queryTo: this.mapIdArray(values?.queryTo),
          queryCc: this.mapIdArray(values?.queryCc),
          vilTo: this.mapIdArray(values?.vilTo),
          vilCc: this.mapIdArray(values?.vilCc),
          dailyStatusTo: this.mapIdArray(values?.dailyStatusTo),
          dailyStatusCc: this.mapIdArray(values?.dailyStatusCc),
          queryStatusTo: this.mapIdArray(values?.queryStatusTo),
          queryStatusCc: this.mapIdArray(values?.queryStatusCc),
        };

        this.supremeService
          .addReferralPartnerDefaultEmail(newData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getReferralPartnerDefaultEmail();
          });
      } else {
        Object.keys(this.defaultEmailForm.controls).forEach((key) => {
          this.defaultEmailForm.controls[key].markAsTouched();
        });
      }
    }
  }

  // QueryTo Linking

  getQueryToData(selectAll: Boolean) {
    if (this.isLoadingQueryTo) {
      return;
    }
    this.isLoadingQueryTo = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryToParams)
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

          this.defaultEmailForm.patchValue({
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
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
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

    this.supremeService
      .getStaffByReferralPartner(this.queryCcParams)
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

          this.defaultEmailForm.patchValue({
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
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
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

    this.supremeService
      .getStaffByReferralPartner(this.vilToParams)
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

          this.defaultEmailForm.patchValue({
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
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
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

    this.supremeService
      .getStaffByReferralPartner(this.vilCcParams)
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

          this.defaultEmailForm.patchValue({
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
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
        vilCc: [],
      });
    }
  }

  // dailyStatusToData Linking

  getDailyStatusToData(selectAll: Boolean) {
    if (this.isLoadingDailyStatusTo) {
      return;
    }
    this.isLoadingDailyStatusTo = true;

    this.supremeService
      .getStaffByReferralPartner(this.dailyStatusToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.dailyStatusToData = [];
        }
        this.dailyStatusToData.push(...res.data.content);
        this.totalElementDailyStatusTo = res.data.totalElement;
        this.dailyStatusToParams.page = this.dailyStatusToParams.page + 1;
        this.isLoadingDailyStatusTo = false;
        if (selectAll) {
          const allConfirmationTo = this.dailyStatusToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allConfirmationTo.forEach((confirmationTo) => {
            const isConfirmationToAlreadySelected =
              this.selectedDailyStatusToSearch.some(
                (selectedConfirmationTo) =>
                  selectedConfirmationTo._id === confirmationTo._id
              );

            if (!isConfirmationToAlreadySelected) {
              this.selectedDailyStatusToSearch.push(confirmationTo);
            }
          });

          this.defaultEmailForm.patchValue({
            dailyStatusTo: this.selectedDailyStatusToSearch,
          });
          this.isLoadingDailyStatusToSelectAll = false;
        }
      });
  }

  onInfiniteScrollDailyStatusTo(): void {
    if (this.dailyStatusToData.length < this.totalElementDailyStatusTo) {
      this.getDailyStatusToData(false);
    }
  }

  searchDailyStatusTo(filterValue: string) {
    clearTimeout(this.timeoutDailyStatusTo);
    this.timeoutDailyStatusTo = setTimeout(() => {
      this.dailyStatusToParams.search = filterValue.trim();
      this.dailyStatusToParams.page = 1;
      this.dailyStatusToParams.limit = 20;
      this.dailyStatusToData = []; // Clear existing data when searching
      this.isLoadingDailyStatusTo = false;
      this.getDailyStatusToData(false);
    }, 600);
  }

  onClickDailyStatusTo(item) {
    const index = this.selectedDailyStatusToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDailyStatusToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDailyStatusToSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      dailyStatusTo: [...new Set(this.selectedDailyStatusToSearch)],
    });
  }

  selectAllDailyStatusTo(event) {
    if (event.checked) {
      this.dailyStatusToParams.page = 1;
      this.dailyStatusToParams.limit = 0;
      this.isLoadingDailyStatusTo = false;
      this.isLoadingDailyStatusToSelectAll = true;
      this.getDailyStatusToData(true);
    } else {
      this.selectedDailyStatusToSearch = [];
      this.defaultEmailForm.patchValue({
        dailyStatusTo: [],
      });
    }
  }

  // dailyStatusCcData Linking

  getDailyStatusCcData(selectAll: Boolean) {
    if (this.isLoadingDailyStatusCc) {
      return;
    }
    this.isLoadingDailyStatusCc = true;

    this.supremeService
      .getStaffByReferralPartner(this.dailyStatusCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.dailyStatusCcData = [];
        }
        this.dailyStatusCcData.push(...res.data.content);
        this.totalElementDailyStatusCc = res.data.totalElement;
        this.dailyStatusCcParams.page = this.dailyStatusCcParams.page + 1;
        this.isLoadingDailyStatusCc = false;
        if (selectAll) {
          const allConfirmationCc = this.dailyStatusCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allConfirmationCc.forEach((confirmationCc) => {
            const isConfirmationCcAlreadySelected =
              this.selectedDailyStatusCcSearch.some(
                (selectedConfirmationCc) =>
                  selectedConfirmationCc._id === confirmationCc._id
              );

            if (!isConfirmationCcAlreadySelected) {
              this.selectedDailyStatusCcSearch.push(confirmationCc);
            }
          });

          this.defaultEmailForm.patchValue({
            dailyStatusCc: this.selectedDailyStatusCcSearch,
          });
          this.isLoadingDailyStatusCcSelectAll = false;
        }
      });
  }

  onInfiniteScrollDailyStatusCc(): void {
    if (this.dailyStatusCcData.length < this.totalElementDailyStatusCc) {
      this.getDailyStatusCcData(false);
    }
  }

  searchDailyStatusCc(filterValue: string) {
    clearTimeout(this.timeoutDailyStatusCc);
    this.timeoutDailyStatusCc = setTimeout(() => {
      this.dailyStatusCcParams.search = filterValue.trim();
      this.dailyStatusCcParams.page = 1;
      this.dailyStatusCcParams.limit = 20;
      this.dailyStatusCcData = []; // Clear existing data when searching
      this.isLoadingDailyStatusCc = false;
      this.getDailyStatusCcData(false);
    }, 600);
  }

  onClickDailyStatusCc(item) {
    const index = this.selectedDailyStatusCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDailyStatusCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDailyStatusCcSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      dailyStatusCc: [...new Set(this.selectedDailyStatusCcSearch)],
    });
  }

  selectAllDailyStatusCc(event) {
    if (event.checked) {
      this.dailyStatusCcParams.page = 1;
      this.dailyStatusCcParams.limit = 0;
      this.isLoadingDailyStatusCc = false;
      this.isLoadingDailyStatusCcSelectAll = true;
      this.getDailyStatusCcData(true);
    } else {
      this.selectedDailyStatusCcSearch = [];
      this.defaultEmailForm.patchValue({
        dailyStatusCc: [],
      });
    }
  }

  // QueryStatusTo Linking

  getQueryStatusToData(selectAll: Boolean) {
    if (this.isLoadingQueryStatusTo) {
      return;
    }
    this.isLoadingQueryStatusTo = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryStatusToParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryStatusToData = [];
        }
        this.queryStatusToData.push(...res.data.content);
        this.totalElementQueryStatusTo = res.data.totalElement;
        this.queryStatusToParams.page = this.queryStatusToParams.page + 1;
        this.isLoadingQueryStatusTo = false;
        if (selectAll) {
          const allDoctorTo = this.queryStatusToData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allDoctorTo.forEach((doctorTo) => {
            const isDoctorToAlreadySelected =
              this.selectedQueryStatusToSearch.some(
                (selectedDoctorTo) => selectedDoctorTo._id === doctorTo._id
              );

            if (!isDoctorToAlreadySelected) {
              this.selectedQueryStatusToSearch.push(doctorTo);
            }
          });

          this.defaultEmailForm.patchValue({
            queryStatusTo: this.selectedQueryStatusToSearch,
          });
          this.isLoadingQueryStatusToSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryStatusTo(): void {
    if (this.queryStatusToData.length < this.totalElementQueryStatusTo) {
      this.getQueryStatusToData(false);
    }
  }

  searchQueryStatusTo(filterValue: string) {
    clearTimeout(this.timeoutDoctorTo);
    this.timeoutDoctorTo = setTimeout(() => {
      this.queryStatusToParams.search = filterValue.trim();
      this.queryStatusToParams.page = 1;
      this.queryStatusToParams.limit = 20;
      this.queryStatusToData = []; // Clear existing data when searching
      this.isLoadingQueryStatusTo = false;
      this.getQueryStatusToData(false);
    }, 600);
  }

  onClickQueryStatusTo(item) {
    const index = this.selectedQueryStatusToSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryStatusToSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryStatusToSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      queryStatusTo: [...new Set(this.selectedQueryStatusToSearch)],
    });
  }

  selectAllQueryStatusTo(event) {
    if (event.checked) {
      this.queryStatusToParams.page = 1;
      this.queryStatusToParams.limit = 0;
      this.isLoadingQueryStatusTo = false;
      this.isLoadingQueryStatusToSelectAll = true;
      this.getQueryStatusToData(true);
    } else {
      this.selectedQueryStatusToSearch = [];
      this.defaultEmailForm.patchValue({
        queryStatusTo: [],
      });
    }
  }

  // Query Status Cc Linking

  getQueryStatusCcData(selectAll: Boolean) {
    if (this.isLoadingQueryStatusCc) {
      return;
    }
    this.isLoadingQueryStatusCc = true;

    this.supremeService
      .getStaffByReferralPartner(this.queryStatusCcParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryStatusCcData = [];
        }
        this.queryStatusCcData.push(...res.data.content);
        this.totalElementQueryStatusCc = res.data.totalElement;
        this.queryStatusCcParams.page = this.queryStatusCcParams.page + 1;
        this.isLoadingQueryStatusCc = false;
        if (selectAll) {
          const allDoctorCc = this.queryStatusCcData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allDoctorCc.forEach((doctorCc) => {
            const isDoctorCcAlreadySelected =
              this.selectedQueryStatusCcSearch.some(
                (selectedDoctorCc) => selectedDoctorCc._id === doctorCc._id
              );

            if (!isDoctorCcAlreadySelected) {
              this.selectedQueryStatusCcSearch.push(doctorCc);
            }
          });

          this.defaultEmailForm.patchValue({
            queryStatusCc: this.selectedQueryStatusCcSearch,
          });
          this.isLoadingQueryStatusCcSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryStatusCc(): void {
    if (this.queryStatusCcData.length < this.totalElementQueryStatusCc) {
      this.getQueryStatusCcData(false);
    }
  }

  searchQueryStatusCc(filterValue: string) {
    clearTimeout(this.timeoutQueryStatusCc);
    this.timeoutQueryStatusCc = setTimeout(() => {
      this.queryStatusCcParams.search = filterValue.trim();
      this.queryStatusCcParams.page = 1;
      this.queryStatusCcParams.limit = 20;
      this.queryStatusCcData = []; // Clear existing data when searching
      this.isLoadingQueryStatusCc = false;
      this.getQueryStatusCcData(false);
    }, 600);
  }

  onClickQueryStatusc(item) {
    const index = this.selectedQueryStatusCcSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryStatusCcSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryStatusCcSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      queryStatusCc: [...new Set(this.selectedQueryStatusCcSearch)],
    });
  }

  selectAllQueryStatusCc(event) {
    if (event.checked) {
      this.queryStatusCcParams.page = 1;
      this.queryStatusCcParams.limit = 0;
      this.isLoadingQueryStatusCc = false;
      this.isLoadingQueryStatusCcSelectAll = true;
      this.getQueryStatusCcData(true);
    } else {
      this.selectedQueryStatusCcSearch = [];
      this.defaultEmailForm.patchValue({
        queryStatusCc: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
