import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
@Component({
  selector: "shared-top-hospital",
  templateUrl: "./top-hospital.component.html",
  styleUrls: ["./top-hospital.component.scss"],
})
export class TopHospitalComponent implements OnInit {
  topHospitalForm: FormGroup;
  topHospitalData: any;
  isLoading: Boolean = true;

  // Hospital Linking
  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 20,
    search: "",
  };
  timeoutHospital = null;
  isLoadingHospital = false;
  isLoadingHospitalSelectAll = false;
  selectedHospitalSearch: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.getTopHospital();
    this.getHospitalData(false);
  }
  buildForm() {
    this.topHospitalForm = this.formBuilder.group({
      hospital: [[], [Validators.required]],
    });
  }
  getTopHospital() {
    this.isLoading = true;
    this.facilitatorService.getTopHospital().subscribe(
      (res: any) => {
        this.topHospitalData = res.data;
        this.isLoading = false;
        // console.log('this.topHospitalData',this.topHospitalData)
        if (this.topHospitalData) {
          this.selectedHospitalSearch = this.topHospitalData.hospital;
          this.topHospitalForm.patchValue({
            hospital: this.selectedHospitalSearch,
          });
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  formSubmit() {
    // console.log('this.topHospitalForm', this.topHospitalForm.value)
    if (this.topHospitalForm.valid) {
      this.facilitatorService
        .addTopHospital(this.topHospitalForm.value)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.getTopHospital();
        });
    } else {
      Object.keys(this.topHospitalForm.controls).forEach((key) => {
        this.topHospitalForm.controls[key].markAsTouched();
      });
    }
  }

  // Hospital Linking

  getHospitalData(selectAll: Boolean) {
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

        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;
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

          this.topHospitalForm.patchValue({
            hospital: this.selectedHospitalSearch,
          });
          this.isLoadingHospitalSelectAll = false;
        }
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getHospitalData(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getHospitalData(false);
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedHospitalSearch.push(item);
    }
    this.topHospitalForm.patchValue({
      hospital: [...new Set(this.selectedHospitalSearch)],
    });
    // console.log('hospital', this.topHospitalForm.get('hospital').value)
    // console.log('this.selectedHospitalSearch', this.selectedHospitalSearch)
  }
  selectAllHospital(event) {
    if (event.checked) {
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 0;
      this.isLoadingHospital = false;
      this.isLoadingHospitalSelectAll = true;
      this.getHospitalData(true);
    } else {
      this.selectedHospitalSearch = [];
      this.topHospitalForm.patchValue({
        hospital: [],
      });
    }
  }
  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
