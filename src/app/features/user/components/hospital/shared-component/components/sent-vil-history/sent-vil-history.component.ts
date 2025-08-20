import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import tippy, { Instance } from "tippy.js";
import { startCase } from "lodash";
import { SentVilHistoryFilterComponent } from "src/app/shared/components/dialogs/sent-vil-history-filter/sent-vil-history-filter.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "shared-sent-vil-history",
  templateUrl: "./sent-vil-history.component.html",
  styleUrls: ["./sent-vil-history.component.scss"],
})
export class SentVilHistoryComponent implements OnInit {
  displayedColumns = [
    "createdAt",
    "hospital",
    "userName",
    "userType",
    "referenceNo",
    "patientName",
    "country",
    "treatment",
    "passportNumber",
    "sendTo",
    "status",
  ];

  sentVilData = new MatTableDataSource<any>([]);

  sentVilParams: any = {
    limit: 10,
    page: 1,
    search: "",
    filterObj: {},
  };

  constructor(
    private hospitalService: HospitalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllSentVil();
  }

  isLoading: boolean = true;
  totalElement = 0;
  getAllSentVil() {
    this.sentVilData.data = [];
    this.isLoading = true;
    this.hospitalService.getAllSentVil(this.sentVilParams).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.sentVilData.data = res?.data.content;
        this.totalElement = res?.data?.totalElement;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPaginateChange(value) {
    this.sentVilParams.limit = value.pageSize;
    this.sentVilParams.page = value.pageIndex + 1;
    this.getAllSentVil();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  timeout = null;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.sentVilParams.search = filterValue.trim();
      this.sentVilParams.page = 1;
      this.paginator.firstPage();
      this.getAllSentVil();
    }, 600);
  }

  toolTip: any;
  showSendToDetailsOnHover(tooltipButton: any, item: any) {
    let eventString = "";
    if (item?.sendTo === "patient") {
      eventString = `
      <div><strong>Patient Name:</strong> ${startCase(
        item?.patient?.name
      )}</div>
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>
`;
      eventString += `<div><strong>Contact:</strong> ${
        item?.contact?.length > 0 ? item.contact.join(", ") : "NIL"
      }</div>`;
    } else if (item?.sendTo === "referral partner") {
      eventString = `
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>      
`;
      eventString += `<div><strong>Contact:</strong> ${
        item?.contact?.length > 0 ? item.contact.join(", ") : "NIL"
      }</div>`;
    } else if (item?.sendTo === "embassy") {
      eventString = `
      <div><strong>Email To:</strong> ${item?.emailTo || "NIL"}</div>
      <div><strong> Email Cc:</strong> ${
        item?.emailCc?.length > 0 ? item?.emailCc?.join(", ") : "NIL"
      }</div>      
`;
      eventString += `<div><strong>Contact:</strong> ${
        item?.contact?.length > 0 ? item.contact.join(", ") : "NIL"
      }</div>`;
    }

    let tooltipInstance: any = tippy(tooltipButton, {
      content: eventString,
      trigger: "hover",
      placement: "bottom",
      theme: "custom",
      allowHTML: true,
      delay: [0, 0],
      duration: [0, 0],
      onShow(instance) {
        instance.popper.style.backgroundColor = "white";
        instance.popper.style.color = "black";
        instance.popper.style.border = "1px solid lightgrey";
        instance.popper.style.borderRadius = "8px";
        instance.popper.style.padding = "12px";
        instance.popper.style.width = "400px";
      },
    });

    this.toolTip = tooltipInstance;

    tooltipInstance.show();
  }

  hideDetails(tooltipButton: any, item: any) {
    this.toolTip.hide();
  }

  isFilterSelected = false;
  selectedFilters: any = {};
  openFilterModal() {
    const dialogRef = this.dialog.open(SentVilHistoryFilterComponent, {
      width: "40%",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.componentInstance.dialogTitle = "Issued VIL Filter";
    dialogRef.componentInstance.selectedFilters = this.selectedFilters;

    dialogRef.afterClosed().subscribe((result) => {
      const { apiCall, filterData, type } = result;

      if (type === "reset") {
        this.isFilterSelected = false;
        this.sentVilParams.page = "1";
        this.sentVilParams.filterObj = {};
        this.paginator.firstPage();
        this.getAllSentVil();
      }

      if (apiCall) {
        this.selectedFilters = filterData;
        const { hospital, userType, treatment, country, userName } = filterData;
        if (
          hospital?.length > 0 ||
          country?.length > 0 ||
          treatment?.length > 0 ||
          userType?.length > 0 ||
          userName?.length > 0
        ) {
          this.isFilterSelected = true;
          this.sentVilParams.page = "1";
          let filterObj = {};
          if (hospital?.length > 0) {
            filterObj["hospital"] = this.filterIdArray(hospital);
          }
          if (userName?.length > 0) {
            filterObj["userName"] = this.filterIdArray(userName || []);
          }
          if (userType?.length > 0) {
            filterObj["vilUserType"] = userType;
          }
          if (country) {
            filterObj["country"] = country;
          }
          if (treatment) {
            filterObj["treatment"] = treatment;
          }

          this.sentVilParams.filterObj = filterObj;
          this.paginator.firstPage();
          this.getAllSentVil();
        }
      }
    });
  }

  returnNameArray(array: any) {
    let nameArray = [];
    if (array?.length > 0) {
      array?.forEach((a: any) => {
        nameArray.push(a?.name);
      });
    }
    return nameArray;
  }

  filterIdArray(array: any) {
    let newArray = [];
    if (array?.length) {
      array.forEach((e) => {
        newArray.push(e?._id);
      });
    }
    return newArray;
  }
}
