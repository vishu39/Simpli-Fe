import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { FormGroupDirective } from "@angular/forms";

@Component({
  selector: "app-shared-default-email",
  templateUrl: "./default-email.component.html",
  styleUrls: ["./default-email.component.scss"],
})
export class DefaultEmailComponent implements OnInit {
  @Input() hospitalId: any;
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

  constructor(
    private formBuilder: FormBuilder,
    private supremeService: SupremeService,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.hospitalId.currentValue) {
      this.getDefaultEmail();

      this.queryToParams.hospital = this.hospitalId;
      this.queryToParams.page = 1;
      this.queryToData = [];
      this.getQueryToData(false);

      this.queryCcParams.hospital = this.hospitalId;
      this.queryCcParams.page = 1;
      this.queryCcData = [];
      this.getQueryCcData(false);

      this.vilToParams.hospital = this.hospitalId;
      this.vilToParams.page = 1;
      this.vilToData = [];
      this.getVilToData(false);

      this.vilCcParams.hospital = this.hospitalId;
      this.vilCcParams.page = 1;
      this.vilCcData = [];
      this.getVilCcData(false);

      this.confirmationToParams.hospital = this.hospitalId;
      this.confirmationToParams.page = 1;
      this.confirmationToData = [];
      this.getConfirmationToData(false);

      this.confirmationCcParams.hospital = this.hospitalId;
      this.confirmationCcParams.page = 1;
      this.confirmationCcData = [];
      this.getConfirmationCcData(false);
    }
  }

  buildForm() {
    this.defaultEmailForm = this.formBuilder.group({
      queryTo: [[], [Validators.required]],
      queryCc: [],
      vilTo: [[], [Validators.required]],
      vilCc: [],
      confirmationTo: [[], [Validators.required]],
      confirmationCc: [],
    });
  }

  getDefaultEmail() {
    this.supremeService
      .getDefaultEmail(this.hospitalId)
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
        this.selectedConfirmationToSearch = this.defaultEmailData
          ?.confirmationTo
          ? this.defaultEmailData?.confirmationTo
          : [];
        this.selectedConfirmationCcSearch = this.defaultEmailData
          ?.confirmationCc
          ? this.defaultEmailData?.confirmationCc
          : [];

        this.defaultEmailForm.patchValue({
          queryTo: this.modifyData(this.selectedQueryToSearch),
          queryCc: this.modifyData(this.selectedQueryCcSearch),
          vilTo: this.modifyData(this.selectedVilToSearch),
          vilCc: this.modifyData(this.selectedVilCcSearch),
          confirmationTo: this.modifyData(this.selectedConfirmationToSearch),
          confirmationCc: this.modifyData(this.selectedConfirmationCcSearch),
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
    if (this.hospitalId) {
      if (this.defaultEmailForm.valid) {
        this.defaultEmailForm.value.hospitalId = this.hospitalId;
        let values = this.defaultEmailForm.value;
        let newData = {
          hospitalId: this.hospitalId,
          queryTo: this.mapIdArray(values?.queryTo),
          queryCc: this.mapIdArray(values?.queryCc),
          vilTo: this.mapIdArray(values?.vilTo),
          vilCc: this.mapIdArray(values?.vilCc),
          confirmationTo: this.mapIdArray(values?.confirmationTo),
          confirmationCc: this.mapIdArray(values?.confirmationCc),
        };

        this.supremeService
          .addDefaultEmail(this.defaultEmailForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getDefaultEmail();
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

  // ConfirmationTo Linking

  getConfirmationToData(selectAll: Boolean) {
    if (this.isLoadingConfirmationTo) {
      return;
    }
    this.isLoadingConfirmationTo = true;

    this.supremeService
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

          this.defaultEmailForm.patchValue({
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
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
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

    this.supremeService
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

          this.defaultEmailForm.patchValue({
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
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
        confirmationCc: [],
      });
    }
  }
  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
