import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-message-fetch-assign-opd",
  templateUrl: "./message-fetch-assign-opd.component.html",
  styleUrls: ["./message-fetch-assign-opd.component.scss"],
})
export class MessageFetchAssignOpdComponent implements OnInit {
  isLoadingTopHospital: boolean = true;
  topHospitalData = [];
  topHospitalDataForAggregator = [];
  opdForm: FormGroup;
  @Input() messageData: any;
  @Input() emailFetchData: any;

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

  selectedHospital = {
    hospitalId: "",
    hospitalName: "",
  };

  checkContactData: any;
  isCheckEmailClicked: boolean = false;

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllOpdRequest();
    this.opdForm = this._fb.group({
      opdRequest: [, [Validators.required]],
      doctorName: [""],
      patient: this.emailFetchData?._id,
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
    this.opdForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

  getAllOpdRequest() {
    this.hospitalService
      .getAllOpdRequest(this.emailFetchData?._id)
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
      this.hospitalService
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
    this.hospitalService.getTopHospital().subscribe((res: any) => {
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
        if (this.allOpdRequest?.length) {
          this.filterHospitalByRequest(this.hospitalData);
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
    const { patient, doctorName, receivedAt } = this.opdForm.getRawValue();
    let newArray = [];
    let obj = {
      hospitalId: this.selectedHospital?.hospitalId,
      hospitalName: this.selectedHospital?.hospitalName,
      doctorName,
    };
    newArray.push(obj);
    let newPayload = {
      patient: patient,
      opdRequest: newArray,
      receivedAt: receivedAt,
    };
    return newPayload;
  }

  selectedTab = "Email Details";
  changeTab(event: any) {
    this.selectedTab = event.tab.textLabel;
  }
}
