import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddHospitalDialogComponent } from "../../../../dialog/add-hospital-dialog/add-hospital-dialog.component";
import { cloneDeep } from "lodash";
import { AcknowledgementModalComponent } from "src/app/shared/components/dialogs/acknowledgement-modal/acknowledgement-modal.component";

@Component({
  selector: "shared-add-opd-request",
  templateUrl: "./add-opd-request.component.html",
  styleUrls: ["./add-opd-request.component.scss"],
})
export class AddOpdRequestComponent implements OnInit {
  isLoadingTopHospital: boolean = true;
  topHospitalData = [];
  topHospitalDataForAggregator = [];
  opdForm: FormGroup;
  @Input() patientData: any;

  allOpdRequest: any;
  // hospital variables
  hospitalData = [];
  hospitalDataForAggregator = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };

  // aggregator variables
  aggregatorList: any = [];
  freshAggregatorList: any = [];
  timeoutAggregator = null;
  totalElementAggrigator: number;
  isAggregatorLoading: boolean = false;
  selectedAggregatorSearch = [];

  selectedHospital = {
    hospitalId: "",
    hospitalName: "",
  };

  checkContactData: any;
  isCheckEmailClicked: boolean = false;

  constructor(
    private faciliatorService: FacilitatorService,
    private sharedService: SharedService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<AddHospitalDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllAggregator();
    this.getAllOpdRequest();
    this.opdForm = this._fb.group({
      opdRequest: [, [Validators.required]],
      aggregator: [""],
      doctorName: [""],
      receivedAt: [""],
      patient: this.patientData?._id,
    });
  }

  getAllOpdRequest() {
    this.faciliatorService
      .getAllOpdRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.allOpdRequest = res?.data;
        this.getTopHospital();
        this.getAllHospital();
      });
  }

  filterTopHospitalByRequest(topHospitalData: any) {
    if (this.allOpdRequest?.length) {
      let resData = topHospitalData;
      this.allOpdRequest?.forEach((data: any) => {
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
    this.allOpdRequest?.forEach((data: any) => {
      let index = resData?.findIndex((rd: any) => rd?._id === data?.hospitalId);
      if (index !== -1) {
        resData.splice(index, 1);
      }
    });
    this.hospitalData.push(...resData);
  }

  getOpinionRequestRecipients() {
    if (this.opdForm.valid) {
      let values = this.modifyPayload();
      delete values["aggregator"];
      values?.opdRequest?.map((opd: any) => {
        delete opd["doctorName"];
      });
      this.faciliatorService
        .getOpdRequestRecipients(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.isCheckEmailClicked = true;
          this.checkContactData = res?.data;
        });
    }
  }

  freshTopHospital = [];
  getTopHospital() {
    this.isLoadingTopHospital = true;
    this.faciliatorService.getTopHospital().subscribe((res: any) => {
      this.topHospitalDataForAggregator.push(...res?.data?.hospital);
      this.freshTopHospital.push(...res?.data?.hospital);
      if (this.allOpdRequest?.length) {
        this.filterTopHospitalByRequest(res?.data?.hospital);
        this.isLoadingTopHospital = false;
      } else {
        this.topHospitalData.push(...res?.data?.hospital);
        this.isLoadingTopHospital = false;
      }
    });
  }

  topHospitalChange(data: any) {
    this.selectedHospital = {
      hospitalId: data?._id,
      hospitalName: data?.name,
    };
    this.opdForm.patchValue({
      opdRequest: data?._id,
    });
  }

  aggregatorRequestList = [];
  freshHospitalData = [];
  getAllHospital() {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        this.hospitalDataForAggregator.push(...res?.data?.content);
        this.hospitalData.push(...res.data.content);
        this.freshHospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;

        // for hospital
        if (
          this.allOpdRequest?.length &&
          !this.aggregatorRequestList?.length &&
          !this.opdForm.get("aggregator").value
        ) {
          this.filterHospitalByRequest(this.hospitalData);
        }
        if (
          this.aggregatorRequestList?.length ||
          !!this.opdForm.get("aggregator").value
        ) {
          this.filterAggregator(this.aggregatorRequestList);
        }

        this.isLoadingHospital = false;
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.freshHospitalData.length < this.totalElementHospital) {
      this.getAllHospital();
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
      this.getAllHospital();
    }, 600);
  }

  // aggregator api's
  getAllAggregator() {
    if (this.isAggregatorLoading) {
      return;
    }
    this.isAggregatorLoading = true;

    this.sharedService.getAllAggregator().subscribe((res: any) => {
      this.aggregatorList.push(...res.data);
      this.freshAggregatorList.push(...res.data);
      this.totalElementAggrigator = res.data.totalElement;
      this.isAggregatorLoading = false;
    });
  }

  searchAggregator(filterValue: string) {
    clearTimeout(this.timeoutAggregator);
    this.timeoutAggregator = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.freshAggregatorList);
        this.aggregatorList = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.aggregatorList = filterArray;
      } else {
        this.aggregatorList = this.freshAggregatorList;
      }
    }, 600);
  }

  onClickAggregator(item: any) {
    this.selectedHospitalSearch = [];
    this.selectedHospital = {
      hospitalId: "",
      hospitalName: "",
    };
    this.opdForm.patchValue({
      opdRequest: [...new Set([])],
    });
    this.getAllOpdRequestByAggregator(item);
  }

  getAllOpdRequestByAggregator(item: any) {
    let payload = {
      patient: this.patientData?._id,
      aggregator: item?._id,
    };
    this.faciliatorService
      .getAllOpdRequestByAggregator(payload)
      .subscribe((res: any) => {
        this.aggregatorRequestList = res?.data;
        this.filterAggregator(res?.data);
      });
  }

  filterAggregator(data: any) {
    if (data?.length) {
      let hospitalData = cloneDeep(this.hospitalDataForAggregator);
      let topHospitalData = cloneDeep(this.topHospitalDataForAggregator);
      data?.forEach((data: any) => {
        let hospitalIndex = hospitalData?.findIndex(
          (rd: any) => rd?._id === data?.hospitalId
        );
        let topHospitalIndex = topHospitalData?.findIndex(
          (rd: any) => rd?._id === data?.hospitalId
        );
        if (hospitalIndex !== -1) {
          hospitalData.splice(hospitalIndex, 1);
        }
        if (topHospitalIndex !== -1) {
          topHospitalData.splice(topHospitalIndex, 1);
        }
      });
      this.hospitalData = hospitalData;
      this.topHospitalData = topHospitalData;
    } else {
      this.hospitalData = cloneDeep(this.hospitalDataForAggregator);
      this.topHospitalData = cloneDeep(this.topHospitalDataForAggregator);
    }
  }

  submit() {
    if (this.opdForm.valid) {
      let values = this.modifyPayload();
      this.faciliatorService.addOpdRequest(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "opdRequest",
          patient: this.patientData?._id,
        };
        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.dialogRef.close(true);
      });
    } else {
      this.opdForm.markAllAsTouched();
    }
  }

  onClickHospital(item: any) {
    this.selectedHospital = {
      hospitalId: item?._id,
      hospitalName: item?.name,
    };
    this.opdForm.patchValue({
      opdRequest: item?._id,
    });
  }

  modifyPayload() {
    const { aggregator, patient, doctorName, receivedAt } = this.opdForm.value;
    let newArray = [];
    let obj = {
      hospitalId: this.selectedHospital?.hospitalId,
      hospitalName: this.selectedHospital?.hospitalName,
      doctorName,
    };
    newArray.push(obj);
    let newPayload = {
      aggregator: aggregator,
      patient: patient,
      opdRequest: newArray,
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
