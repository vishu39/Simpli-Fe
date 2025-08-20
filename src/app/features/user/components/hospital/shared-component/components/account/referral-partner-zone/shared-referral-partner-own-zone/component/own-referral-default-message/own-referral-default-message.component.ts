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
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-own-referral-default-message",
  templateUrl: "./own-referral-default-message.component.html",
  styleUrls: ["./own-referral-default-message.component.scss"],
})
export class OwnReferralDefaultMessageComponent implements OnInit {
  @Input() referralId: any;

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  defaultEmailForm: FormGroup;
  defaultEmailData: any;
  // QueryMessage Linking
  queryMessageData: any = [];
  totalElementQueryMessage: number;
  queryMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
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
    referralPartner: "",
    type: "employee",
  };
  timeoutVilMessage = null;
  isLoadingVilMessage = false;
  isLoadingVilMessageSelectAll = false;
  selectedVilMessageSearch: any = [];

  // daily status Linking
  dailyStatusMessageData: any = [];
  totalElementDailyStatusMessage: number;
  dailyStatusMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutDailyStatusMessage = null;
  isLoadingDailyStatusMessage = false;
  isLoadingDailyStatusMessageSelectAll = false;
  selectedDailyStatusMessageSearch: any = [];

  // query Status message Linking
  queryStatusMessageData: any = [];
  totalElementQueryStatusMessage: number;
  queryStatusMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    referralPartner: "",
    type: "employee",
  };
  timeoutQueryStatusMessage = null;
  isLoadingQueryStatusMessage = false;
  isLoadingQueryStatusMessageSelectAll = false;
  selectedQueryStatusMessageSearch: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.referralId.currentValue) {
      this.getReferralPartnerDefaultMessage();

      this.queryMessageParams.referralPartner = this.referralId;
      this.queryMessageParams.page = 1;
      this.queryMessageData = [];
      this.getQueryMessageData(false);

      this.vilMessageParams.referralPartner = this.referralId;
      this.vilMessageParams.page = 1;
      this.vilMessageData = [];
      this.getVilMessageData(false);

      this.dailyStatusMessageParams.referralPartner = this.referralId;
      this.dailyStatusMessageParams.page = 1;
      this.dailyStatusMessageData = [];
      this.getDailyStatusMessageData(false);

      this.queryStatusMessageParams.referralPartner = this.referralId;
      this.queryStatusMessageParams.page = 1;
      this.queryStatusMessageData = [];
      this.getQueryStatusMessageData(false);

      this.defaultEmailForm.controls["queryMessage"].enable();
      this.defaultEmailForm.controls["vilMessage"].enable();
      this.defaultEmailForm.controls["dailyStatusMessage"].enable();
      this.defaultEmailForm.controls["queryStatusMessage"].enable();
    }
  }

  ngOnInit(): void {}

  buildForm() {
    this.defaultEmailForm = this.formBuilder.group({
      queryMessage: [[], [Validators.required]],
      vilMessage: [[], [Validators.required]],
      dailyStatusMessage: [[], [Validators.required]],
      queryStatusMessage: [[], [Validators.required]],
    });
  }

  getReferralPartnerDefaultMessage() {
    this.hospitalService
      .getReferralPartnerDefaultMessage(this.referralId)
      .subscribe((res: any) => {
        this.defaultEmailData = res.data;
        // console.log('this.defaultEmailData', this.defaultEmailData)
        if (!this.defaultEmailData) {
          this.formDirective.resetForm(); // Reset the ugly validators
        }

        let mappedQueryMessage = this.modifyDefaultData(
          this.defaultEmailData?.queryMessage || []
        );
        let mappedVilMessage = this.modifyDefaultData(
          this.defaultEmailData?.vilMessage || []
        );
        let mappedDailyStatusMessage = this.modifyDefaultData(
          this.defaultEmailData?.dailyStatusMessage || []
        );
        let mappedQueryStatusMessage = this.modifyDefaultData(
          this.defaultEmailData?.queryStatusMessage || []
        );

        this.selectedQueryMessageSearch = mappedQueryMessage;
        this.selectedVilMessageSearch = mappedVilMessage;
        this.selectedDailyStatusMessageSearch = mappedDailyStatusMessage;
        this.selectedQueryStatusMessageSearch = mappedQueryStatusMessage;

        this.defaultEmailForm.patchValue({
          queryMessage: this.selectedQueryMessageSearch,
          vilMessage: this.selectedVilMessageSearch,
          dailyStatusMessage: this.selectedDailyStatusMessageSearch,
          queryStatusMessage: this.selectedQueryStatusMessageSearch,
        });
      });
  }

  formSubmit() {
    if (this.referralId) {
      if (this.defaultEmailForm.valid) {
        this.defaultEmailForm.value.referralId = this.referralId;

        let values = this.defaultEmailForm.value;

        let newDefaultData = {
          referralPartnerId:
            this.defaultEmailData?.referralId || this.referralId,
          queryMessage: this.mapIdArray(values?.queryMessage),
          vilMessage: this.mapIdArray(values?.vilMessage),
          dailyStatusMessage: this.mapIdArray(values?.dailyStatusMessage),
          queryStatusMessage: this.mapIdArray(values?.queryStatusMessage),
        };

        this.hospitalService
          .addReferralPartnerDefaultMessage(newDefaultData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getReferralPartnerDefaultMessage();
          });
      } else {
        Object.keys(this.defaultEmailForm.controls).forEach((key) => {
          this.defaultEmailForm.controls[key].markAsTouched();
        });
      }
    }
  }

  modifyDefaultData(array: any) {
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

  mapIdArray(array: any) {
    let modifiedArray = [];
    if (array?.length > 0) {
      array.forEach((a: any) => {
        modifiedArray.push(a?._id);
      });
    }
    return modifiedArray;
  }

  // QueryMessage Linking

  getQueryMessageData(selectAll: Boolean) {
    if (this.isLoadingQueryMessage) {
      return;
    }
    this.isLoadingQueryMessage = true;

    this.hospitalService
      .getStaffByReferralPartner(this.queryMessageParams)
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

          this.defaultEmailForm.patchValue({
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
      this.selectedQueryMessageSearch.push({
        _id: item?._id,
        name: item?.name,
      });
    }
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
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

    this.hospitalService
      .getStaffByReferralPartner(this.vilMessageParams)
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

          this.defaultEmailForm.patchValue({
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
      this.selectedVilMessageSearch.push({
        _id: item?._id,
        name: item?.name,
      });
    }
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
        vilMessage: [],
      });
    }
  }

  // dailystaus Linking

  getDailyStatusMessageData(selectAll: Boolean) {
    if (this.isLoadingDailyStatusMessage) {
      return;
    }
    this.isLoadingDailyStatusMessage = true;

    this.hospitalService
      .getStaffByReferralPartner(this.dailyStatusMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.dailyStatusMessageData = [];
        }
        this.dailyStatusMessageData.push(...res.data.content);
        this.totalElementDailyStatusMessage = res.data.totalElement;
        this.dailyStatusMessageParams.page =
          this.dailyStatusMessageParams.page + 1;
        this.isLoadingDailyStatusMessage = false;
        if (selectAll) {
          const allDailyStatusMessage = this.dailyStatusMessageData.map(
            (item) => ({
              _id: item._id,
              name: item.name,
            })
          );
          allDailyStatusMessage.forEach((dailyStatusMessage) => {
            const isDailyStatusMessageAlreadySelected =
              this.selectedDailyStatusMessageSearch.some(
                (selectedDailyStatusMessage) =>
                  selectedDailyStatusMessage._id === dailyStatusMessage._id
              );

            if (!isDailyStatusMessageAlreadySelected) {
              this.selectedDailyStatusMessageSearch.push(dailyStatusMessage);
            }
          });

          this.defaultEmailForm.patchValue({
            dailyStatusMessage: this.selectedDailyStatusMessageSearch,
          });
          this.isLoadingDailyStatusMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollDailyStatusMessage(): void {
    if (
      this.dailyStatusMessageData.length < this.totalElementDailyStatusMessage
    ) {
      this.getDailyStatusMessageData(false);
    }
  }

  searchDailyStatusMessage(filterValue: string) {
    clearTimeout(this.timeoutDailyStatusMessage);
    this.timeoutDailyStatusMessage = setTimeout(() => {
      this.dailyStatusMessageParams.search = filterValue.trim();
      this.dailyStatusMessageParams.page = 1;
      this.dailyStatusMessageParams.limit = 20;
      this.dailyStatusMessageData = []; // Clear existing data when searching
      this.isLoadingDailyStatusMessage = false;
      this.getDailyStatusMessageData(false);
    }, 600);
  }

  onClickDailyStatusMessage(item) {
    const index = this.selectedDailyStatusMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedDailyStatusMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedDailyStatusMessageSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      dailyStatusMessage: [...new Set(this.selectedDailyStatusMessageSearch)],
    });
  }

  selectAllDailyStatusMessage(event) {
    if (event.checked) {
      this.dailyStatusMessageParams.page = 1;
      this.dailyStatusMessageParams.limit = 0;
      this.isLoadingDailyStatusMessage = false;
      this.isLoadingDailyStatusMessageSelectAll = true;
      this.getDailyStatusMessageData(true);
    } else {
      this.selectedDailyStatusMessageSearch = [];
      this.defaultEmailForm.patchValue({
        dailyStatusMessage: [],
      });
    }
  }

  // query status Linking

  getQueryStatusMessageData(selectAll: Boolean) {
    if (this.isLoadingQueryStatusMessage) {
      return;
    }
    this.isLoadingQueryStatusMessage = true;

    this.hospitalService
      .getStaffByReferralPartner(this.queryStatusMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.queryStatusMessageData = [];
        }
        this.queryStatusMessageData.push(...res.data.content);
        this.totalElementQueryStatusMessage = res.data.totalElement;
        this.queryStatusMessageParams.page =
          this.queryStatusMessageParams.page + 1;
        this.isLoadingQueryStatusMessage = false;
        if (selectAll) {
          const allDailyStatusMessage = this.queryStatusMessageData.map(
            (item) => ({
              _id: item._id,
              name: item.name,
            })
          );
          allDailyStatusMessage.forEach((dailyStatusMessage) => {
            const isDailyStatusMessageAlreadySelected =
              this.selectedQueryStatusMessageSearch.some(
                (selectedDailyStatusMessage) =>
                  selectedDailyStatusMessage._id === dailyStatusMessage._id
              );

            if (!isDailyStatusMessageAlreadySelected) {
              this.selectedQueryStatusMessageSearch.push(dailyStatusMessage);
            }
          });

          this.defaultEmailForm.patchValue({
            queryStatusMessage: this.selectedQueryStatusMessageSearch,
          });
          this.isLoadingQueryStatusMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollQueryStatusMessage(): void {
    if (
      this.queryStatusMessageData.length < this.totalElementQueryStatusMessage
    ) {
      this.getQueryStatusMessageData(false);
    }
  }

  searchQueryStatusMessage(filterValue: string) {
    clearTimeout(this.timeoutQueryStatusMessage);
    this.timeoutQueryStatusMessage = setTimeout(() => {
      this.queryStatusMessageParams.search = filterValue.trim();
      this.queryStatusMessageParams.page = 1;
      this.queryStatusMessageParams.limit = 20;
      this.queryStatusMessageData = []; // Clear existing data when searching
      this.isLoadingQueryStatusMessage = false;
      this.getQueryStatusMessageData(false);
    }, 600);
  }

  onClickQueryStatusMessage(item) {
    const index = this.selectedQueryStatusMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedQueryStatusMessageSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedQueryStatusMessageSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      queryStatusMessage: [...new Set(this.selectedQueryStatusMessageSearch)],
    });
  }

  selectAllQueryStatusMessage(event) {
    if (event.checked) {
      this.queryStatusMessageParams.page = 1;
      this.queryStatusMessageParams.limit = 0;
      this.isLoadingQueryStatusMessage = false;
      this.isLoadingQueryStatusMessageSelectAll = true;
      this.getQueryStatusMessageData(true);
    } else {
      this.selectedQueryStatusMessageSearch = [];
      this.defaultEmailForm.patchValue({
        queryStatusMessage: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
