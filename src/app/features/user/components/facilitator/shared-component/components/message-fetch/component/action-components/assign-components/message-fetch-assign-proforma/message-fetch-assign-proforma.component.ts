import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { cloneDeep } from "lodash";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-message-fetch-assign-proforma",
  templateUrl: "./message-fetch-assign-proforma.component.html",
  styleUrls: ["./message-fetch-assign-proforma.component.scss"],
})
export class MessageFetchAssignProformaComponent implements OnInit {
  @Input() messageData: any;
  @Input() emailFetchData: any;

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
    private facilitatorService: FacilitatorService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllAggregator();
    this.getAllProformaInvoiceRequest();
  }

  buildForm() {
    this.proformaInvoiceForm = this.formBuilder.group({
      proformaInvoiceRequest: [[], [Validators.required]],
      aggregator: [""],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
      patient: [this.emailFetchData?._id],
    });

    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.proformaInvoiceForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

  getAllProformaInvoiceRequest() {
    this.facilitatorService
      .getAllProformaInvoiceRequest(this?.emailFetchData?._id)
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
    this.facilitatorService.getTopHospital().subscribe((res: any) => {
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
        if (
          this.allPreIntemationRequest?.length &&
          !this.aggregatorRequestList?.length &&
          !this.proformaInvoiceForm.get("aggregator").value
        ) {
          this.filterHospitalByRequest(this.hospitalData);
        }
        if (
          this.aggregatorRequestList?.length ||
          !!this.proformaInvoiceForm.get("aggregator").value
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
      this.facilitatorService
        .getProformaInvoiceRecipients(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.isCheckEmailClicked = true;
          // console.log(res?.data);
          this.checkContactData = res?.data;
        });
    }
  }

  modifyPayload() {
    const { aggregator, patient, proformaInvoiceRequest, receivedAt } =
      this.proformaInvoiceForm.getRawValue();
    let newArray = [];
    proformaInvoiceRequest?.forEach((opinion: any) => {
      let obj = {
        hospitalId: opinion?._id,
        hospitalName: opinion?.name,
      };
      newArray.push(obj);
    });
    let newPayload = {
      aggregator: aggregator,
      patient: patient,
      proformaInvoiceRequest: newArray,
      receivedAt: receivedAt,
    };
    return newPayload;
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
    this.proformaInvoiceForm.patchValue({
      proformaInvoiceRequest: [],
    });
    this.getAllProformaInvoiceRequestByAggregator(item);
  }

  getAllProformaInvoiceRequestByAggregator(item: any) {
    let payload = {
      patient: this.emailFetchData?._id,
      aggregator: item?._id,
    };
    this.facilitatorService
      .getAllProformaInvoiceRequestByAggregator(payload)
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

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
