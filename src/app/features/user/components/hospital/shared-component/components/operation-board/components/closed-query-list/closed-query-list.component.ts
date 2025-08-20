import { Component, OnInit } from "@angular/core";
import { OperationBoardFilterComponent } from "../../dialog/operation-board-filter/operation-board-filter.component";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { AddCommentsDialogComponent } from "../../dialog/add-comments-dialog/add-comments-dialog.component";
import { patientStatus } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "shared-closed-query-list",
  templateUrl: "./closed-query-list.component.html",
  styleUrls: ["./closed-query-list.component.scss"],
})
export class ClosedQueryListComponent implements OnInit {
  actionButtons = [
    // { icon: "download", color: "warn" },
    { icon: "filter_list", color: "accent" },
  ];

  currentDate = new Date();

  totalElement: number = 0;

  isQuerryLoading = false;
  listData = [];

  searchParams: any = {
    page: 1,
    limit: 10,
    search: {
      name: "",
      country: "",
      treatment: "",
      referralPartner: "",
    },
    filterObj: {},
  };

  constructor(
    private dialog: MatDialog,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {
    this.sharedService.callApiForCompletedAndFinance
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          // this.searchParams.page = 1;
          // this.listData = [];
          // this.getQuerryData();
          this.setFilterAfterGet(this.filterItem);
          this.sharedService.callApiForCompletedAndFinance.next(false);
        }
      });
  }

  // On component destroy
  private destroy$ = new Subject<void>();
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterItem: any = {};
  ngOnInit(): void {
    this.filterItem = this.getFilterFromStorage();
    if (
      this.filterItem?.search?.name?.length > 0 ||
      this.filterItem?.search?.country?.length > 0 ||
      this.filterItem?.search?.treatment?.length > 0 ||
      this.filterItem?.search?.referralPartner?.length > 0 ||
      this.filterItem?.filterObj?.user?.length > 0
    ) {
      this.setFilterAfterGet(this.filterItem);
    } else {
      this.getQuerryData();
    }
  }

  allowedStatuses = [
    patientStatus.preIntimationSent,
    patientStatus.opinionRequested,
    patientStatus.opdRequested,
    patientStatus.proformaInvoiceRequested,
    patientStatus.vilRequested,
    patientStatus.confirmationSent,
  ];

  getQuerryData() {
    this.isQuerryLoading = true;
    this.hospitalService.getCompletedQueryList(this.searchParams).subscribe(
      (res: any) => {
        this.totalElement = res?.data?.totalElement;
        this.listData.push(...res.data.content);
        this.searchParams.page = this.searchParams.page + 1;
        this.isQuerryLoading = false;
        // this.listData?.forEach((ld: any, index: number) => {
        //   let currentStatus = ld?.currentStatus.filter((obj) =>
        //     this.allowedStatuses.includes(obj.status)
        //   );
        //   ld.currentStatus = currentStatus;
        // });
      },
      (err) => {
        this.isQuerryLoading = false;
      }
    );
  }

  onInfiniteScrollQuerry(): void {
    if (!this.isQuerryLoading) {
      if (this.listData.length < this.totalElement) {
        this.getQuerryData();
      }
    }
  }

  action(type: string) {
    if (type === "filter_list") {
      this.openFilterModal();
    }
  }

  filterActive(btn: string) {
    let { name, country, treatment, referralPartner } =
      this.searchParams.search;
    let user: any = this.searchParams.filterObj.user;
    if (btn === "filter_list") {
      if (
        name?.length > 0 ||
        country?.length > 0 ||
        treatment?.length > 0 ||
        referralPartner?.length > 0 ||
        user?.length > 0
      ) {
        return "filter_active";
      }
    }
    return "";
  }

  openFilterModal() {
    const dialogRef = this.dialog.open(OperationBoardFilterComponent, {
      width: "70%",
      disableClose: true,
      autoFocus: false,
      data: {
        params: {
          ...this.searchParams?.search,
          ...this.searchParams?.filterObj,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.apiCall === true) {
        this.listData = [];
        this.searchParams.page = 1;
        let userArray = [];
        if (result?.data?.user?.length > 0) {
          userArray = result?.data?.user;
          delete result?.data?.user;
        } else {
          delete result?.data?.user;
        }

        this.searchParams.search = result?.data;
        this.searchParams.filterObj = {
          user: userArray,
        };
        // this.getQuerryData();

        this.setFilterInLocalStorage({
          search: { ...this.searchParams.search },
          filterObj: { ...this.searchParams.filterObj },
        });

        this.setFilterAfterGet({
          search: { ...this.searchParams.search },
          filterObj: { ...this.searchParams.filterObj },
        });
      }
    });
  }

  storageKey = "Closed";
  getFilterFromStorage() {
    let item = localStorage.getItem(
      `operationBoard${this.storageKey}QueryFilters`
    );
    let parsedItem = {};
    if (item) {
      parsedItem = JSON.parse(item);
    }
    return parsedItem;
  }

  setFilterInLocalStorage(data: any) {
    let stringifyData = JSON.stringify(data);
    localStorage.setItem(
      `operationBoard${this.storageKey}QueryFilters`,
      stringifyData
    );
  }

  setFilterAfterGet(data: any) {
    this.listData = [];
    this.searchParams.page = 1;
    if (
      this.filterItem?.search?.name?.length > 0 ||
      this.filterItem?.search?.country?.length > 0 ||
      this.filterItem?.search?.treatment?.length > 0 ||
      this.filterItem?.search?.referralPartner?.length > 0
    ) {
      this.searchParams.search = data?.search;
    }
    if (this.filterItem?.filterObj?.user?.length > 0) {
      this.searchParams.filterObj = data?.filterObj;
    }
    this.getQuerryData();
  }

  openCommentModal(item: any) {
    const dialogRef = this.dialog.open(AddCommentsDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        itemData: item,
        title: "Completed Query",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}
