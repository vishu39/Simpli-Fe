import { Component, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddHospitalDialogComponent } from "../../../../dialog/add-hospital-dialog/add-hospital-dialog.component";
import { cloneDeep } from "lodash";
import { AcknowledgementModalComponent } from "src/app/shared/components/dialogs/acknowledgement-modal/acknowledgement-modal.component";

@Component({
  selector: "shared-add-opinion",
  templateUrl: "./add-opinion.component.html",
  styleUrls: ["./add-opinion.component.scss"],
})
export class AddOpinionComponent implements OnInit {
  @Input() patientData: any;

  isLoadingTopHospital: boolean = true;
  selectedTopHospitalList = [];

  allOpinionRequest: any;
  aggregatorList: any = [];
  freshAggregatorList: any = [];
  timeoutAggregator = null;
  totalElementAggrigator: number;
  isAggregatorLoading: boolean = false;
  selectedAggregatorSearch = [];

  hospitalData = [];
  hospitalDataForAggregator = [];
  freshHospitalData = [];
  hospitalDataAfterFilter = [];
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll: boolean = false;
  totalElementHospital: number;
  selectedHospitalSearch = [];
  opinionRequestForm: FormGroup;
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
    private faciliatorService: FacilitatorService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddHospitalDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllAggregator();
    this.getAllOpinionRequest();
  }

  buildForm() {
    this.opinionRequestForm = this.formBuilder.group({
      opinionRequest: [[], [Validators.required]],
      aggregator: [""],
      patient: [this.patientData?._id],
      receivedAt: [""],
    });
  }

  getAllOpinionRequest() {
    this.faciliatorService
      .getAllOpinionRequest(this.patientData?._id)
      .subscribe((res: any) => {
        this.allOpinionRequest = res?.data;
        this.getAllHospital(false);
        this.getTopHospital();
      });
  }

  filterTopHospitalByRequest(topHospitalData: any) {
    if (this.allOpinionRequest?.length) {
      let resData = topHospitalData;
      this.allOpinionRequest?.forEach((data: any) => {
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
    this.allOpinionRequest?.forEach((data: any) => {
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
    this.opinionRequestForm.patchValue({
      opinionRequest: [...new Set(this.selectedHospitalSearch)],
    });
  }
  isItemInArray(item: any): boolean {
    return this.opinionRequestForm
      ?.get("opinionRequest")
      ?.value.some((preItem) => preItem._id === item._id);
  }

  freshTopHospital = [];
  getTopHospital() {
    this.isLoadingTopHospital = true;
    this.faciliatorService.getTopHospital().subscribe((res: any) => {
      this.topHospitalDataForAggregator.push(...res?.data?.hospital);
      this.freshTopHospital.push(...res?.data?.hospital);
      if (this.allOpinionRequest?.length) {
        this.filterTopHospitalByRequest(res?.data?.hospital);
        this.isLoadingTopHospital = false;
      } else {
        this.topHospitalData.push(...res?.data?.hospital);
        this.isLoadingTopHospital = false;
      }
    });
  }

  aggregatorRequestList = [];
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
        this.hospitalDataForAggregator.push(...res.data.content);
        this.freshHospitalData.push(...res.data.content);
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;

        // for hospital
        if (
          this.allOpinionRequest?.length &&
          !this.aggregatorRequestList?.length &&
          !this.opinionRequestForm.get("aggregator").value
        ) {
          this.filterHospitalByRequest(this.hospitalData);
        }
        if (
          this.aggregatorRequestList?.length ||
          !!this.opinionRequestForm.get("aggregator").value
        ) {
          this.filterAggregator(this.aggregatorRequestList);
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

          this.opinionRequestForm.patchValue({
            opinionRequest: this.selectedHospitalSearch,
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
      this.hospitalDataForAggregator = []; // Clear existing data when searching
      this.freshHospitalData = []; // Clear existing data when searching
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
    this.opinionRequestForm.patchValue({
      opinionRequest: [...new Set(this.selectedHospitalSearch)],
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
      this.opinionRequestForm.patchValue({
        opinionRequest: [],
      });
    }
  }

  getAllAggregator(selectAll: boolean = false) {
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
    this.opinionRequestForm.patchValue({
      opinionRequest: [...new Set([])],
    });
    this.getAllOpinionRequestByAggregator(item);
  }

  getAllOpinionRequestByAggregator(item: any) {
    let payload = {
      patient: this.patientData?._id,
      aggregator: item?._id,
    };
    this.faciliatorService
      .getAllOpinionRequestByAggregator(payload)
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

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }

  getOpinionRequestRecipients() {
    if (this.opinionRequestForm.valid) {
      let values = this.modifyPayload();
      this.faciliatorService
        .getOpinionRequestRecipients(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.isCheckEmailClicked = true;
          this.checkContactData = res?.data;
        });
    }
  }

  submit() {
    if (this.opinionRequestForm.valid) {
      let values = this.modifyPayload();
      this.faciliatorService.addOpinion(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "opinionRequest",
          patient: this.patientData?._id,
        };
        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.dialogRef.close(true);
      });
    } else {
      this.opinionRequestForm.markAllAsTouched();
    }
  }

  modifyPayload() {
    const { aggregator, patient, opinionRequest, receivedAt } =
      this.opinionRequestForm.value;
    let newArray = [];
    opinionRequest?.forEach((opinion: any) => {
      let obj = {
        hospitalId: opinion?._id,
        hospitalName: opinion?.name,
      };
      newArray.push(obj);
    });
    let newPayload = {
      aggregator: aggregator,
      patient: patient,
      opinionRequest: newArray,
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
