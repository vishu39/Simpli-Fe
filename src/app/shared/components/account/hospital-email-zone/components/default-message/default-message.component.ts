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
  selector: "shared-default-message",
  templateUrl: "./default-message.component.html",
  styleUrls: ["./default-message.component.scss"],
})
export class DefaultMessageComponent implements OnInit {
  @Input() hospitalId: any;

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
    private supremeService: SupremeService,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.hospitalId.currentValue) {
      this.getDefaultMessage();

      this.queryMessageParams.hospital = this.hospitalId;
      this.queryMessageParams.page = 1;
      this.queryMessageData = [];
      this.getQueryMessageData(false);

      this.vilMessageParams.hospital = this.hospitalId;
      this.vilMessageParams.page = 1;
      this.vilMessageData = [];
      this.getVilMessageData(false);

      this.confirmationMessageParams.hospital = this.hospitalId;
      this.confirmationMessageParams.page = 1;
      this.confirmationMessageData = [];
      this.getConfirmationMessageData(false);

      this.defaultEmailForm.controls["queryMessage"].enable();
      this.defaultEmailForm.controls["vilMessage"].enable();
      this.defaultEmailForm.controls["confirmationMessage"].enable();
    }
  }

  ngOnInit(): void {}

  buildForm() {
    this.defaultEmailForm = this.formBuilder.group({
      queryMessage: [[], [Validators.required]],
      vilMessage: [[], [Validators.required]],
      confirmationMessage: [[], [Validators.required]],
    });
  }

  getDefaultMessage() {
    this.supremeService
      .getDefaultMessage(this.hospitalId)
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
        let mappedConfiramtionMessage = this.modifyDefaultData(
          this.defaultEmailData?.confirmationMessage || []
        );

        this.selectedQueryMessageSearch = mappedQueryMessage;
        this.selectedVilMessageSearch = mappedVilMessage;
        this.selectedConfirmationMessageSearch = mappedConfiramtionMessage;

        this.defaultEmailForm.patchValue({
          queryMessage: this.selectedQueryMessageSearch,
          vilMessage: this.selectedVilMessageSearch,
          confirmationMessage: this.selectedConfirmationMessageSearch,
        });
      });
  }

  formSubmit() {
    if (this.hospitalId) {
      if (this.defaultEmailForm.valid) {
        this.defaultEmailForm.value.hospitalId = this.hospitalId;

        let values = this.defaultEmailForm.value;

        let newDefaultData = {
          confirmationMessage: this.mapIdArray(values?.confirmationMessage),
          hospitalId: this.defaultEmailData?.hospitalId || this.hospitalId,
          queryMessage: this.mapIdArray(values?.queryMessage),
          vilMessage: this.mapIdArray(values?.vilMessage),
        };

        this.supremeService
          .addDefaultMessage(newDefaultData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getDefaultMessage();
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

    this.supremeService
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

    this.supremeService
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

  // ConfirmationMessage Linking

  getConfirmationMessageData(selectAll: Boolean) {
    if (this.isLoadingConfirmationMessage) {
      return;
    }
    this.isLoadingConfirmationMessage = true;

    this.supremeService
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

          this.defaultEmailForm.patchValue({
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
      this.selectedConfirmationMessageSearch.push({
        _id: item?._id,
        name: item?.name,
      });
    }
    this.defaultEmailForm.patchValue({
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
      this.defaultEmailForm.patchValue({
        confirmationMessage: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
