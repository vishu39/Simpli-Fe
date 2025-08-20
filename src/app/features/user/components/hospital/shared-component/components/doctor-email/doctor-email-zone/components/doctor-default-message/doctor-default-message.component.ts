import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { doctorStaffType } from "src/app/core/models/role";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-doctor-default-message",
  templateUrl: "./doctor-default-message.component.html",
  styleUrls: ["./doctor-default-message.component.scss"],
})
export class DoctorDefaultMessageComponent implements OnInit {
  @Input() doctorId: any;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  defaultEmailForm: FormGroup;
  defaultEmailData: any;
  // Assistant Doctor Linking
  assistantDoctorData: any = [];
  totalElementAssistant: number;
  assistantDoctorParams = {
    page: 1,
    limit: 20,
    search: "",
    doctor: "",
    type: doctorStaffType.assistantDoctor,
  };
  timeoutAssistant = null;
  isLoadingAssistant = false;
  isLoadingAssistantSelectAll = false;
  selectedAssistantDoctorSearch: any = [];

  // Coordinator Linking
  coordinatorData: any = [];
  totalElementCoordinator: number;
  coordinatorParams = {
    page: 1,
    limit: 20,
    search: "",
    doctor: "",
    type: doctorStaffType.coordinator,
  };
  timeoutCoordinator = null;
  isLoadingCoordinator = false;
  isLoadingCoordinatorSelectAll = false;
  selectedCoordinatorSearch: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {
    this.buildForm();
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes.doctorId.currentValue) {
      this.getDoctorDefaultMessage();

      this.assistantDoctorParams.doctor = this.doctorId;
      this.assistantDoctorParams.page = 1;
      this.assistantDoctorData = [];
      this.getAssistantDoctorData(false);

      this.coordinatorParams.doctor = this.doctorId;
      this.coordinatorParams.page = 1;
      this.coordinatorData = [];
      this.getCoordinatorData(false);
    }
  }

  buildForm() {
    this.defaultEmailForm = this.formBuilder.group({
      assistantDoctor: [[]],
      coordinator: [[]],
      doctorId: ["", [Validators.required]],
    });
  }

  getDoctorDefaultMessage() {
    this.hospitalService
      .getDoctorDefaultMessage(this.doctorId)
      .subscribe((res: any) => {
        this.defaultEmailData = res.data;
        if (!this.defaultEmailData) {
          this.formDirective.resetForm();
        }
        this.selectedAssistantDoctorSearch = this.defaultEmailData
          ?.assistantDoctor
          ? this.defaultEmailData?.assistantDoctor
          : [];
        this.selectedCoordinatorSearch = this.defaultEmailData?.coordinator
          ? this.defaultEmailData?.coordinator
          : [];

        this.defaultEmailForm.patchValue({
          assistantDoctor: this.modifyDefaultData(
            this.selectedAssistantDoctorSearch
          ),
          coordinator: this.modifyDefaultData(this.selectedCoordinatorSearch),
        });
      });
  }

  modifyDefaultData(array: any) {
    let modifiedArray = [];
    if (array?.length > 0) {
      array.forEach((a: any) => {
        modifiedArray.push({
          _id: a?._id,
          name: a?.name,
        });
      });
    }
    return modifiedArray;
  }

  mapIdArray(array: any) {
    let modifiedArray = [];
    if (array?.length > 0) {
      array.forEach((a: any) => {
        modifiedArray.push(a?._id);
      });
    }
    return modifiedArray;
  }

  formSubmit() {
    if (this.doctorId) {
      this.defaultEmailForm.patchValue({
        doctorId: this.doctorId,
      });
      if (this.defaultEmailForm.valid) {
        this.defaultEmailForm.value.doctorId = this.doctorId;
        let values = this.defaultEmailForm.getRawValue();
        values.assistantDoctor = this.mapIdArray(values.assistantDoctor || []);
        values.coordinator = this.mapIdArray(values.coordinator || []);
        this.hospitalService
          .addDoctorDefaultMessage(values)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getDoctorDefaultMessage();
          });
      } else {
        Object.keys(this.defaultEmailForm.controls).forEach((key) => {
          this.defaultEmailForm.controls[key].markAsTouched();
        });
      }
    }
  }

  // Assistant Doctor Linking

  getAssistantDoctorData(selectAll: Boolean) {
    if (this.isLoadingAssistant) {
      return;
    }
    this.isLoadingAssistant = true;

    this.hospitalService
      .getDoctorStaffByType(this.assistantDoctorParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.assistantDoctorData = [];
        }
        this.assistantDoctorData.push(...res.data.content);
        this.totalElementAssistant = res.data.totalElement;
        this.assistantDoctorParams.page = this.assistantDoctorParams.page + 1;
        this.isLoadingAssistant = false;
        if (selectAll) {
          const allAssistantDoctor = this.assistantDoctorData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allAssistantDoctor.forEach((assistant) => {
            const isAssistantAlreadySelected =
              this.selectedAssistantDoctorSearch.some(
                (selectedAssistant) => selectedAssistant._id === assistant._id
              );

            if (!isAssistantAlreadySelected) {
              this.selectedAssistantDoctorSearch.push(assistant);
            }
          });

          this.defaultEmailForm.patchValue({
            assistantDoctor: this.selectedAssistantDoctorSearch,
          });
          this.isLoadingAssistantSelectAll = false;
        }
      });
  }

  onInfiniteScrollAssistant(): void {
    if (this.assistantDoctorData.length < this.totalElementAssistant) {
      this.getAssistantDoctorData(false);
    }
  }

  searchAssistant(filterValue: string) {
    clearTimeout(this.timeoutAssistant);
    this.timeoutAssistant = setTimeout(() => {
      this.assistantDoctorParams.search = filterValue.trim();
      this.assistantDoctorParams.page = 1;
      this.assistantDoctorParams.limit = 20;
      this.assistantDoctorData = [];
      this.isLoadingAssistant = false;
      this.getAssistantDoctorData(false);
    }, 600);
  }

  onClickAssistant(item) {
    const index = this.selectedAssistantDoctorSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedAssistantDoctorSearch.splice(index, 1);
    } else {
      this.selectedAssistantDoctorSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      assistantDoctor: [...new Set(this.selectedAssistantDoctorSearch)],
    });
  }

  selectAllAssistant(event) {
    if (event.checked) {
      this.assistantDoctorParams.page = 1;
      this.assistantDoctorParams.limit = 0;
      this.isLoadingAssistant = false;
      this.isLoadingAssistantSelectAll = true;
      this.getAssistantDoctorData(true);
    } else {
      this.selectedAssistantDoctorSearch = [];
      this.defaultEmailForm.patchValue({
        assistantDoctor: [],
      });
    }
  }

  // Coordinator Linking

  getCoordinatorData(selectAll: Boolean) {
    if (this.isLoadingCoordinator) {
      return;
    }
    this.isLoadingCoordinator = true;

    this.hospitalService
      .getDoctorStaffByType(this.coordinatorParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.coordinatorData = [];
        }
        this.coordinatorData.push(...res.data.content);
        this.totalElementCoordinator = res.data.totalElement;
        this.coordinatorParams.page = this.coordinatorParams.page + 1;
        this.isLoadingCoordinator = false;
        if (selectAll) {
          const allCoordinator = this.coordinatorData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allCoordinator.forEach((coordinator) => {
            const isCoordinatorAlreadySelected =
              this.selectedCoordinatorSearch.some(
                (selectedCoordinator) =>
                  selectedCoordinator._id === coordinator._id
              );

            if (!isCoordinatorAlreadySelected) {
              this.selectedCoordinatorSearch.push(coordinator);
            }
          });

          this.defaultEmailForm.patchValue({
            coordinator: this.selectedCoordinatorSearch,
          });
          this.isLoadingCoordinatorSelectAll = false;
        }
      });
  }

  onInfiniteScrollCoordinator(): void {
    if (this.coordinatorData.length < this.totalElementCoordinator) {
      this.getCoordinatorData(false);
    }
  }

  searchCoordinator(filterValue: string) {
    clearTimeout(this.timeoutCoordinator);
    this.timeoutCoordinator = setTimeout(() => {
      this.coordinatorParams.search = filterValue.trim();
      this.coordinatorParams.page = 1;
      this.coordinatorParams.limit = 20;
      this.coordinatorData = []; // Clear existing data when searching
      this.isLoadingCoordinator = false;
      this.getCoordinatorData(false);
    }, 600);
  }

  onClickCoordinator(item) {
    const index = this.selectedCoordinatorSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedCoordinatorSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedCoordinatorSearch.push(item);
    }
    this.defaultEmailForm.patchValue({
      coordinator: [...new Set(this.selectedCoordinatorSearch)],
    });
  }

  selectAllCoordinator(event) {
    if (event.checked) {
      this.coordinatorParams.page = 1;
      this.coordinatorParams.limit = 0;
      this.isLoadingCoordinator = false;
      this.isLoadingCoordinatorSelectAll = true;
      this.getCoordinatorData(true);
    } else {
      this.selectedCoordinatorSearch = [];
      this.defaultEmailForm.patchValue({
        coordinator: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
