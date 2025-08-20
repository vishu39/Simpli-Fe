import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddHospitalDialogComponent } from "../../../../dialog/add-hospital-dialog/add-hospital-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { cloneDeep } from "lodash";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { AcknowledgementModalComponent } from "src/app/shared/components/dialogs/acknowledgement-modal/acknowledgement-modal.component";

@Component({
  selector: "shared-add-proforma-invoice",
  templateUrl: "./add-proforma-invoice.component.html",
  styleUrls: ["./add-proforma-invoice.component.scss"],
})
export class AddProformaInvoiceComponent implements OnInit {
  @Input() patientData: any;

  isLoadingTopHospital: boolean = true;
  selectedTopHospitalList = [];
  allPreIntemationRequest: any;

  aggregatorList: any = [];
  freshAggregatorList: any = [];
  timeoutAggregator = null;
  totalElementAggrigator: number;
  isAggregatorLoading: boolean = false;
  selectedAggregatorSearch = [];

  hospitalData = [];
  hospitalDataForAggregator = [];
  hospitalDataAfterFilter = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  proformaInvoiceForm: FormGroup;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  topHospitalData = [];
  topHospitalDataForAggregator = [];

  checkContactData: any;
  isCheckEmailClicked: boolean = false;

  constructor(
    private sharedService: SharedService,
    private hospitalService: HospitalService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddHospitalDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllProformaInvoiceRequest();
  }

  buildForm() {
    this.proformaInvoiceForm = this.formBuilder.group({
      proformaInvoiceRequest: [[], [Validators.required]],
      receivedAt: [""],
      patient: [this.patientData?._id],
    });
  }

  getAllProformaInvoiceRequest() {
    this.hospitalService
      .getAllProformaInvoiceRequest(this?.patientData?._id)
      .subscribe((res: any) => {
        this.allPreIntemationRequest = res?.data;
        this.getAllHospital(false);
        this.getTopHospital();
      });
  }

  filterTopHospitalByRequest(topHospitalData: any) {
    if (this.allPreIntemationRequest?.length) {
      let resData = topHospitalData;
      this.allPreIntemationRequest?.forEach((data: any) => {
        let index = resData?.findIndex(
          (rd: any) => rd?._id === data?.hospitalId
        );
        if (index !== -1) {
          resData.splice(index, 1);
        }
      });
      this.topHospitalData = resData;
    }
  }

  filterHospitalByRequest(hospitalData: any) {
    this.hospitalData = [];
    let resData = hospitalData;
    this.allPreIntemationRequest?.forEach((data: any) => {
      let index = resData?.findIndex((rd: any) => rd?._id === data?.hospitalId);
      if (index !== -1) {
        resData.splice(index, 1);
      }
    });
    this.hospitalData.push(...resData);
  }

  mcToggle(event: any, item: any) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    // console.log('index', index)
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedHospitalSearch.push(item);
    }
    this.proformaInvoiceForm.patchValue({
      proformaInvoiceRequest: [...new Set(this.selectedHospitalSearch)],
    });
  }
  isItemInArray(item: any): boolean {
    return this.proformaInvoiceForm
      ?.get("proformaInvoiceRequest")
      ?.value.some((preItem) => preItem._id === item._id);
  }

  freshTopHospital = [];
  getTopHospital() {
    this.isLoadingTopHospital = true;
    this.hospitalService.getTopHospital().subscribe((res: any) => {
      this.topHospitalDataForAggregator.push(...res?.data?.hospital);
      this.freshTopHospital.push(...res?.data?.hospital);
      if (this.allPreIntemationRequest?.length) {
        this.filterTopHospitalByRequest(res?.data?.hospital);
        this.isLoadingTopHospital = false;
      } else {
        this.topHospitalData.push(...res?.data?.hospital);
        this.isLoadingTopHospital = false;
      }
    });
  }

  aggregatorRequestList = [];
  freshHospitalData = [];
  getAllHospital(selectAll: Boolean) {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.hospitalData = [];
        }

        this.freshHospitalData.push(...res.data.content);
        this.hospitalDataForAggregator.push(...res.data.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
        // for hospital
        if (this.allPreIntemationRequest?.length) {
          this.filterHospitalByRequest(this.hospitalData);
        }

        this.isLoadingHospital = false;
        if (selectAll) {
          const allHospital = this.hospitalData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedHospitalSearch.some(
              (selectedHospital) => selectedHospital._id === hospital._id
            );

            if (!isHospitalAlreadySelected) {
              this.selectedHospitalSearch.push(hospital);
            }
          });

          this.proformaInvoiceForm.patchValue({
            proformaInvoiceRequest: this.selectedHospitalSearch,
          });
          this.isLoadingHospitalSelectAll = false;
        }
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.freshHospitalData.length < this.totalElementHospital) {
      this.getAllHospital(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = []; // Clear existing data when searching
      this.freshHospitalData = []; // Clear existing data when searching
      this.hospitalDataForAggregator = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getAllHospital(false);
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    // console.log('index', index)
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedHospitalSearch.push(item);
    }
    this.proformaInvoiceForm.patchValue({
      proformaInvoiceRequest: [...new Set(this.selectedHospitalSearch)],
    });
  }
  selectAllHospital(event: any) {
    if (event.checked) {
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 0;
      this.isLoadingHospital = false;
      this.isLoadingHospitalSelectAll = true;
      this.getAllHospital(true);
    } else {
      this.selectedHospitalSearch = [];
      this.proformaInvoiceForm.patchValue({
        proformaInvoiceRequest: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  getProformaInvoiceRecipients() {
    if (this.proformaInvoiceForm.valid) {
      let values = this.modifyPayload();
      this.hospitalService
        .getProformaInvoiceRecipients(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.isCheckEmailClicked = true;
          // console.log(res?.data);
          this.checkContactData = res?.data;
        });
    }
  }

  submit() {
    if (this.proformaInvoiceForm.valid) {
      let values = this.modifyPayload();
      this.hospitalService
        .addProformaInvoiceRequest(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let acknowledgementPayload = {
            eventName: "proformaInvoiceRequest",
            patient: this.patientData?._id,
          };
          this.acknowledgementPopupByEvent(acknowledgementPayload, values);
          // this.dialogRef.close(true);
        });
    } else {
      this.proformaInvoiceForm.markAllAsTouched();
    }
  }

  modifyPayload() {
    const { patient, proformaInvoiceRequest, receivedAt } =
      this.proformaInvoiceForm.value;
    let newArray = [];
    proformaInvoiceRequest?.forEach((opinion: any) => {
      let obj = {
        hospitalId: opinion?._id,
        hospitalName: opinion?.name,
      };
      newArray.push(obj);
    });
    let newPayload = {
      patient: patient,
      proformaInvoiceRequest: newArray,
      receivedAt: receivedAt,
    };
    return newPayload;
  }

  acknowledgementData: any;
  acknowledgementPopupByEvent(payload: any, values: any) {
    this.sharedService
      .acknowledgementPopupByEvent(payload)
      .subscribe((res: any) => {
        this.acknowledgementData = res?.data;
        if (!this.acknowledgementData?.found) {
          this.dialogRef.close(true);
        } else {
          this.openAcknowledgePopup(payload, values);
          this.dialogRef.close(true);
        }
      });
  }

  openAcknowledgePopup(payload: any, values: any) {
    const dialogRef = this.dialog.open(AcknowledgementModalComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "";
    dialogRef.componentInstance.acknowledgementData = this.acknowledgementData;
    dialogRef.componentInstance.acknowledgementPayload = payload;
    dialogRef.componentInstance.eventPayload = values;
    dialogRef.componentInstance.type = payload?.eventName;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
      }
    });
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
