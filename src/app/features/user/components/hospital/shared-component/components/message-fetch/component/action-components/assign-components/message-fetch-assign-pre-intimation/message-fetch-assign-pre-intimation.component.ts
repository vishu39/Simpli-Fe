import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-message-fetch-assign-pre-intimation",
  templateUrl: "./message-fetch-assign-pre-intimation.component.html",
  styleUrls: ["./message-fetch-assign-pre-intimation.component.scss"],
})
export class MessageFetchAssignPreIntimationComponent implements OnInit {
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
  preIntimationForm: FormGroup;
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
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllPreIntimationRequest();
  }

  buildForm() {
    this.preIntimationForm = this.formBuilder.group({
      preIntimation: [[], [Validators.required]],
      aggregator: [""],
      patient: [this.emailFetchData?._id],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
    });

    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.preIntimationForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

  getAllPreIntimationRequest() {
    this.hospitalService
      .getAllPreIntimation(this.emailFetchData?._id)
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
    this.preIntimationForm.patchValue({
      preIntimation: [...new Set(this.selectedHospitalSearch)],
    });
  }
  isItemInArray(item: any): boolean {
    return this.preIntimationForm
      ?.get("preIntimation")
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
        if (
          this.allPreIntemationRequest?.length &&
          !this.aggregatorRequestList?.length &&
          !this.preIntimationForm.get("aggregator").value
        ) {
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

          this.preIntimationForm.patchValue({
            preIntimation: this.selectedHospitalSearch,
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
    this.preIntimationForm.patchValue({
      preIntimation: [...new Set(this.selectedHospitalSearch)],
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
      this.preIntimationForm.patchValue({
        preIntimation: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id;
  }

  getPreIntimationRecipients() {
    if (this.preIntimationForm.valid) {
      let values = this.modifyPayload();
      delete values["aggregator"];
      this.hospitalService
        .getPreIntimationRecipients(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.isCheckEmailClicked = true;
          this.checkContactData = res?.data;
        });
    }
  }

  modifyPayload() {
    const { patient, preIntimation, receivedAt } =
      this.preIntimationForm.getRawValue();
    let newArray = [];
    preIntimation?.forEach((opinion: any) => {
      let obj = {
        hospitalId: opinion?._id,
        hospitalName: opinion?.name,
      };
      newArray.push(obj);
    });
    let newPayload = {
      patient: patient,
      preIntimation: newArray,
      receivedAt: receivedAt,
    };
    return newPayload;
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
