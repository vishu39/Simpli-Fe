import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import {
  genderNaming,
  monthsNaming,
  quaterNaming,
  updatedNaming,
} from "../../dashboardConstant";

@Component({
  selector: "app-dashboard-revamp-filter-modal",
  templateUrl: "./dashboard-revamp-filter-modal.component.html",
  styleUrls: ["./dashboard-revamp-filter-modal.component.scss"],
})
export class DashboardRevampFilterModalComponent implements OnInit {
  dialogTitle: string = "";
  appliedFilters: any = {};

  hiddenCardsArray: any = [];
  selectedUpdatedArray: any = [];
  selectedYearArray: any = [];
  selectedMonthArray: any = [];
  selectedQuaterArray: any = [];
  selectedGenderArray: any = [];
  hospital: any = [];
  country: any = [];
  treatment: any = [];
  referralPartner: any = [];
  doctor: any = [];
  user: any = [];
  dateRange: any;
  ageFrom: any;
  ageTo: any;
  ageDuration: any;

  updatedNaming = updatedNaming;
  monthsNaming = monthsNaming;
  genderNaming = genderNaming;
  quaterNaming = quaterNaming;

  constructor(
    private dialogRef: MatDialogRef<DashboardRevampFilterModalComponent>
  ) {}

  ngOnInit(): void {
    this.hiddenCardsArray = this.appliedFilters?.hiddenCards;
    this.selectedUpdatedArray = this.appliedFilters?.selectedUpdatedArray;
    this.selectedYearArray = this.appliedFilters?.selectedYearArray;
    this.selectedMonthArray = this.appliedFilters?.selectedMonthArray;
    this.selectedQuaterArray = this.appliedFilters?.selectedQuaterArray;
    this.selectedGenderArray = this.appliedFilters?.selectedGenderArray;
    this.hospital = this.appliedFilters?.hospital;
    this.country = this.appliedFilters?.country;
    this.treatment = this.appliedFilters?.treatment;
    this.referralPartner = this.appliedFilters?.referralPartner;
    this.user = this.appliedFilters?.user;
    this.doctor = this.appliedFilters?.doctor;
    this.ageFrom = this.appliedFilters?.ageFrom;
    this.ageDuration = this.appliedFilters?.ageDuration;
    this.ageTo = this.appliedFilters?.ageTo;
    this.dateRange = this.appliedFilters?.dateRange;
  }

  cardHiddenArray: any = [];
  onClickCardShow(index: any) {
    if (this.hiddenCardsArray?.length) {
      this.hiddenCardsArray?.splice(index, 1);
    }
  }

  closeDialog(apiCall: boolean) {
    this.dialogRef.close({
      apiCall,
      data: {
        hiddenCards: this.hiddenCardsArray,
      },
    });
  }
}
