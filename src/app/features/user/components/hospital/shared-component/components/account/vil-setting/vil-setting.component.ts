import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { AddVilSettingComponent } from "./add-vil-setting/add-vil-setting.component";
import { CommonService } from "src/app/smvt-framework/services/common.service";

const dialogButtonConfig = [
  { name: "NO", color: "warn" },
  { name: "YES", color: "primary" },
];

@Component({
  selector: "app-shared-vil-setting",
  templateUrl: "./vil-setting.component.html",
  styleUrls: ["./vil-setting.component.scss"],
})
export class VilSettingComponent implements OnInit {
  vilSettingForm: FormGroup;
  vilSettingData: any;
  isLoading: boolean = true;

  displayedColumns: string[] = [
    "signingAuthorityName",
    "signingAuthorityEmailId",
    "signingAuthorityDesignation",
    "signingAuthorityContactNo",
    "signature",
    "action",
  ];

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    public svc: CommonService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getVilSetting();
  }

  buildForm() {
    this.vilSettingForm = this.fb.group({
      referenceNoSeries: ["", [Validators.required]],
    });
  }

  getVilSetting() {
    this.isLoading = true;
    this.hospitalService.getVilSetting().subscribe((res: any) => {
      this.vilSettingData = res?.data;
      if (!!this.vilSettingData) {
        this.patchFormData(this.vilSettingData);
      }
      this.isLoading = false;
    });
  }

  signatoryData = new MatTableDataSource<any>([]);
  signatoryFreshData = [];

  patchFormData(data: any) {
    if (!!data) {
      this.signatoryData.data = data?.signatory;
      this.signatoryFreshData = data?.signatory;
      this.vilSettingForm.patchValue({
        referenceNoSeries: data?.referenceNoSeries,
      });
    }
  }

  timeout = null;
  isSearchLoading = false;
  search(filterValue: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.signatoryFreshData);
        this.signatoryData.data = [];
        this.isSearchLoading = true;
        let filterData = filterArray.filter((f: any) =>
          f?.signingAuthorityName
            ?.toLowerCase()
            .includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.signatoryData.data = filterArray;
        this.isSearchLoading = false;
      } else {
        this.signatoryData.data = this.signatoryFreshData;
        this.isSearchLoading = false;
      }
    }, 600);
  }

  addSignatory(heading: string, isEdit = false, data = {}) {
    const dialogRef = this.dialog.open(AddVilSettingComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = heading;
    dialogRef.componentInstance.isEdit = isEdit;
    dialogRef.componentInstance.signatoryData = data;

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.getVilSetting();
      }
    });
  }

  deleteSignatroy(item: any) {
    this.svc.ui
      .warnDialog("Sure you want to delete ?", dialogButtonConfig, 4)
      .subscribe((res) => {
        if (res.button.name === "YES") {
          this.hospitalService
            .deleteVilSetting(item?._id)
            ?.subscribe((res: any) => {
              this.getVilSetting();
              this.sharedService.showNotification(
                "snackBar-success",
                res.message
              );
            });
        }
      });
  }

  onClickDownload(data: any) {
    this.sharedService.getS3Object({ key: data?.key }).subscribe((res: any) => {
      window.open(res?.data, "_blank");
    });
  }

  submit() {
    if (this.vilSettingForm.valid) {
      const formData = new FormData();
      const { referenceNoSeries } = this.vilSettingForm.value;
      formData.append("referenceNoSeries", referenceNoSeries);

      this.hospitalService
        .editVilSetting(formData, { isReference: true })
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.vilSettingForm.markAllAsTouched();
    }
  }
}
