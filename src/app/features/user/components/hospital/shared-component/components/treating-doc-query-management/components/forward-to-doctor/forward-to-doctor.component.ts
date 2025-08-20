import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { doctorStaffType } from "src/app/core/models/role";
import FileSaver from "file-saver";
import { getExtensionFromMimeType } from "src/app/shared/constant";

@Component({
  selector: "app-forward-to-doctor",
  templateUrl: "./forward-to-doctor.component.html",
  styleUrls: ["./forward-to-doctor.component.scss"],
})
export class ForwardToDoctorComponent implements OnInit {
  dialogTitle: string;
  patient: any;

  isLoadingRequest = false;
  opinionForm: FormGroup;
  doctorsList = [];
  doctorFreshList: any = [];
  timeoutDoctor = null;
  request = [];

  dataLoading = false;

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
    private dialogRef: MatDialogRef<ForwardToDoctorComponent>,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService
  ) {}

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  ngOnInit(): void {
    this.buildForm();
    this.getForwardToDocSource();
    this.getPendingOpinionRequest();
  }

  sourceArray = [];
  getForwardToDocSource() {
    this.sharedService.getForwardToDocSource().subscribe((res: any) => {
      this.sourceArray = res?.data;
      if (this.sourceArray?.length > 0) {
        let emailIndex = this.sourceArray?.findIndex(
          (sa: any) => sa === "Email"
        );
        if (emailIndex !== -1) {
          this.opinionForm.patchValue({
            source: this.sourceArray[emailIndex] || "",
          });
        }
      }
    });
  }

  onCLickSource(event: any) {
    let { value } = event;
    let emailIdControl = this.opinionForm.get("emailId");
    let contactControl = this.opinionForm.get("contact");
    if (value === "Handout") {
      emailIdControl.clearValidators();
      emailIdControl.updateValueAndValidity();

      contactControl.clearValidators();
      contactControl.updateValueAndValidity();
    } else {
      emailIdControl?.setValidators([
        Validators.required,
        Validators.pattern(regexService.emailRegex),
      ]);
      emailIdControl.updateValueAndValidity();

      contactControl?.setValidators([Validators.required]);
      contactControl.updateValueAndValidity();
    }
  }

  getPendingOpinionRequestByDoctor() {
    this.hospitalService
      .getPendingOpinionRequestByDoctor(this.patient?._id)
      .subscribe((res: any) => {
        let pendingData = res?.data;
        pendingData.forEach((pd: any) => {
          let index = this.request.findIndex(
            (r: any) => r?.hospitalId === pd?.hospitalId
          );
          if (index !== -1) {
            this.request.splice(index, 1);
          }
        });
      });
  }

  buildForm() {
    this.opinionForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      doctorName: ["", [Validators.required]],
      doctorId: [""],
      emailId: [
        "",
        [Validators.required, Validators.pattern(regexService.emailRegex)],
      ],
      contact: [""],
      assistantDoctor: [[]],
      coordinator: [[]],
      assistantDoctorMessage: [[]],
      coordinatorMessage: [[]],
      patient: [this.patient?._id, [Validators.required]],
      source: ["", [Validators.required]],
    });
  }

  getPendingOpinionRequest() {
    this.isLoadingRequest = true;
    this.hospitalService
      .getPendingOpinionRequest(this.patient?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
        this.getPendingOpinionRequestByDoctor();
      });
  }

  onClickHospital(item: any) {
    this.doctorsList = [];
    this.doctorFreshList = [];
    this.opinionForm.get("doctorName")?.reset();
    this.opinionForm.get("doctorId")?.reset();
    this.opinionForm.get("accreditation")?.reset();
    this.opinionForm.get("hospitalCity")?.reset();

    this.getHospitalById(item?.hospitalId);
    this.opinionForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
    });
  }

  getHospitalById(id: string) {
    this.dataLoading = true;
    this.sharedService.startLoader();
    this.sharedService
      .getCmsData(`getHospital/${id}`, {})
      .subscribe((res: any) => {
        if (res?.data) {
          let newAggredation = [];
          res?.data?.accreditation?.forEach((a: any) => {
            newAggredation.push(a?.name);
          });
          this.opinionForm.patchValue({
            accreditation: newAggredation,
            hospitalCity: res?.data?.city[0]?.name,
          });
          this.doctorsList.push(...res?.data?.doctor);
          this.doctorFreshList = this.doctorsList;
          this.dataLoading = false;
          this.sharedService.stopLoader();
        }
      });
  }

  getDoctorById(id: string) {
    this.dataLoading = true;
    this.sharedService.startLoader();
    this.sharedService
      .getCmsData(`getDoctor/${id}`, {})
      .subscribe((res: any) => {
        if (res?.data) {
          this.opinionForm.patchValue({
            emailId: res?.data?.emailId,
            contact: res?.data?.contact,
          });
        }
      });
  }

  onClickDoctor(item: any) {
    this.selectedCoordinatorSearch = [];
    this.selectedAssistantDoctorSearch = [];
    this.opinionForm.patchValue({
      assistantDoctor: [],
      coordinator: [],
      assistantDoctorMessage: [],
      coordinatorMessage: [],
    });

    this.assistantDoctorParams.doctor = item?._id;
    this.assistantDoctorParams.page = 1;
    this.assistantDoctorData = [];
    this.getAssistantDoctorData(false);

    this.coordinatorParams.doctor = item?._id;
    this.coordinatorParams.page = 1;
    this.coordinatorData = [];
    this.getCoordinatorData(false);

    this.assistantDoctorMessageParams.doctor = item?._id;
    this.assistantDoctorMessageParams.page = 1;
    this.assistantDoctorMessageData = [];
    this.getAssistantDoctorMessageData(false);

    this.coordinatorMessageParams.doctor = item?._id;
    this.coordinatorMessageParams.page = 1;
    this.coordinatorMessageData = [];
    this.getCoordinatorMessageData(false);

    this.opinionForm.patchValue({
      doctorId: item?._id,
      doctorName: item?.name,
    });
    this.getDoctorById(item?._id);
    this.getDoctorDefaultEmail(item?._id);
    this.getDoctorDefaultMessage(item?._id);
  }

  searchDoctor(filterValue: string) {
    clearTimeout(this.timeoutDoctor);
    this.timeoutDoctor = setTimeout(() => {
      if (!!filterValue) {
        let filterArray = cloneDeep(this.doctorFreshList);
        this.doctorsList = [];
        let filterData = filterArray.filter((f: any) =>
          f?.name?.toLowerCase().includes(filterValue?.toLowerCase().trim())
        );
        if (filterData.length) {
          filterArray = filterData;
        } else {
          filterArray = [];
        }
        this.doctorsList = filterArray;
      } else {
        this.doctorsList = this.doctorFreshList;
      }
    }, 600);
  }

  submit() {
    if (this.opinionForm?.valid) {
      const {
        hospitalId,
        hospitalName,
        emailId,
        doctorName,
        doctorId,
        patient,
        assistantDoctor,
        coordinator,
        source,
        contact,
        assistantDoctorMessage,
        coordinatorMessage,
      } = this.opinionForm?.value;
      let payload = {
        doctorOpinionRequest: {
          hospitalId,
          hospitalName,
          emailId,
          doctorName,
          doctorId,
          assistantDoctor,
          coordinator,
          source,
          contact,
          assistantDoctorMessage,
          coordinatorMessage,
        },
        patient,
      };

      if (source === "Handout") {
        payload["doctorOpinionRequest"]["assistantDoctor"] = [];
        payload["doctorOpinionRequest"]["coordinator"] = [];
        payload["doctorOpinionRequest"]["assistantDoctorMessage"] = [];
        payload["doctorOpinionRequest"]["coordinatorMessage"] = [];
        payload["doctorOpinionRequest"]["emailId"] = "";
        payload["doctorOpinionRequest"]["contact"] = "";
      }

      this.hospitalService
        .assignOpinionRequestToDoctor(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          let returnedData = res?.data;
          if (!!returnedData && returnedData?.length > 0) {
            this.fileSaverFunction(returnedData);
          } else {
            this.closeDialog(true);
          }
        });
    } else {
      this.opinionForm.markAllAsTouched();
    }
  }

  fileSaverFunction(data: any) {
    data.forEach((e) => {
      if (!!e?.contentType) {
        const uint8Array = new Uint8Array(e?.content?.data);
        let blob = new Blob([uint8Array], { type: e?.contentType });
        FileSaver.saveAs(blob, e?.filename);
      } else {
        fetch(e?.signedUrl)
          .then((response) => response.blob())
          .then((blob) => {
            let fileType = getExtensionFromMimeType(blob?.type);
            FileSaver.saveAs(blob, e.originalname);
          });
      }
      this.closeDialog(true);
    });
  }

  // default email linking
  getDoctorDefaultEmail(doctorId: string) {
    this.hospitalService
      .getDoctorDefaultEmail(doctorId)
      .subscribe((res: any) => {
        this.defaultEmailData = res.data;
        if (!this.defaultEmailData) {
          // this.formDirective.resetForm();
        }
        this.selectedAssistantDoctorSearch = this.defaultEmailData
          ?.assistantDoctor
          ? this.defaultEmailData?.assistantDoctor
          : [];
        this.selectedCoordinatorSearch = this.defaultEmailData?.coordinator
          ? this.defaultEmailData?.coordinator
          : [];

        this.opinionForm.patchValue({
          assistantDoctor: this.selectedAssistantDoctorSearch,
          coordinator: this.selectedCoordinatorSearch,
        });
      });
  }

  // default message linking
  defaultMessageData: any;

  getDoctorDefaultMessage(doctorId: string) {
    this.hospitalService
      .getDoctorDefaultMessage(doctorId)
      .subscribe((res: any) => {
        this.defaultMessageData = res.data;
        if (!this.defaultMessageData) {
          // this.formDirective.resetForm();
        }
        this.selectedAssistantDoctorMessageSearch = this.defaultMessageData
          ?.assistantDoctor
          ? this.defaultMessageData?.assistantDoctor
          : [];
        this.selectedCoordinatorMessageSearch = this.defaultMessageData?.coordinator
          ? this.defaultMessageData?.coordinator
          : [];

        this.opinionForm.patchValue({
          assistantDoctorMessage: this.selectedAssistantDoctorMessageSearch,
          coordinatorMessage: this.selectedCoordinatorMessageSearch,
        });
      });
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

          this.opinionForm.patchValue({
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
    this.opinionForm.patchValue({
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
      this.opinionForm.patchValue({
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

          this.opinionForm.patchValue({
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
      this.selectedCoordinatorSearch.splice(index, 1);
    } else {
      this.selectedCoordinatorSearch.push(item);
    }
    this.opinionForm.patchValue({
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
      this.opinionForm.patchValue({
        coordinator: [],
      });
    }
  }

  // Message linking
  // Assistant Doctor Linking
  assistantDoctorMessageData: any = [];
  totalElementMessageAssistant: number;
  assistantDoctorMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    doctor: "",
    type: doctorStaffType.assistantDoctor,
  };
  timeoutAssistantMessage = null;
  isLoadingAssistantMessage = false;
  isLoadingAssistantMessageSelectAll = false;
  selectedAssistantDoctorMessageSearch: any = [];

  getAssistantDoctorMessageData(selectAll: Boolean) {
    if (this.isLoadingAssistantMessage) {
      return;
    }
    this.isLoadingAssistantMessage = true;

    this.hospitalService
      .getDoctorStaffByType(this.assistantDoctorMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.assistantDoctorMessageData = [];
        }
        this.assistantDoctorMessageData.push(...res.data.content);
        this.totalElementMessageAssistant = res.data.totalElement;
        this.assistantDoctorMessageParams.page =
          this.assistantDoctorMessageParams.page + 1;
        this.isLoadingAssistantMessage = false;
        if (selectAll) {
          const allAssistantDoctor = this.assistantDoctorMessageData.map(
            (item) => ({
              _id: item._id,
              name: item.name,
            })
          );
          allAssistantDoctor.forEach((assistant) => {
            const isAssistantAlreadySelected =
              this.selectedAssistantDoctorMessageSearch.some(
                (selectedAssistant) => selectedAssistant._id === assistant._id
              );

            if (!isAssistantAlreadySelected) {
              this.selectedAssistantDoctorMessageSearch.push(assistant);
            }
          });

          this.opinionForm.patchValue({
            assistantDoctorMessage: this.selectedAssistantDoctorMessageSearch,
          });
          this.isLoadingAssistantMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollAssistantMessage(): void {
    if (
      this.assistantDoctorMessageData.length < this.totalElementMessageAssistant
    ) {
      this.getAssistantDoctorMessageData(false);
    }
  }

  searchAssistantMessage(filterValue: string) {
    clearTimeout(this.timeoutAssistantMessage);
    this.timeoutAssistantMessage = setTimeout(() => {
      this.assistantDoctorMessageParams.search = filterValue.trim();
      this.assistantDoctorMessageParams.page = 1;
      this.assistantDoctorMessageParams.limit = 20;
      this.assistantDoctorMessageData = [];
      this.isLoadingAssistantMessage = false;
      this.getAssistantDoctorMessageData(false);
    }, 600);
  }

  onClickAssistantMessage(item) {
    const index = this.selectedAssistantDoctorMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedAssistantDoctorMessageSearch.splice(index, 1);
    } else {
      this.selectedAssistantDoctorMessageSearch.push(item);
    }
    this.opinionForm.patchValue({
      assistantDoctorMessage: [
        ...new Set(this.selectedAssistantDoctorMessageSearch),
      ],
    });
  }

  selectAllAssistantMessage(event) {
    if (event.checked) {
      this.assistantDoctorMessageParams.page = 1;
      this.assistantDoctorMessageParams.limit = 0;
      this.isLoadingAssistantMessage = false;
      this.isLoadingAssistantMessageSelectAll = true;
      this.getAssistantDoctorMessageData(true);
    } else {
      this.selectedAssistantDoctorMessageSearch = [];
      this.opinionForm.patchValue({
        assistantDoctorMessage: [],
      });
    }
  }

  // Coordinator Linking
  coordinatorMessageData: any = [];
  totalElementCoordinatorMessage: number;
  coordinatorMessageParams = {
    page: 1,
    limit: 20,
    search: "",
    doctor: "",
    type: doctorStaffType.coordinator,
  };
  timeoutCoordinatorMessage = null;
  isLoadingCoordinatorMessage = false;
  isLoadingCoordinatorMessageSelectAll = false;
  selectedCoordinatorMessageSearch: any = [];

  getCoordinatorMessageData(selectAll: Boolean) {
    if (this.isLoadingCoordinatorMessage) {
      return;
    }
    this.isLoadingCoordinatorMessage = true;

    this.hospitalService
      .getDoctorStaffByType(this.coordinatorMessageParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.coordinatorMessageData = [];
        }
        this.coordinatorMessageData.push(...res.data.content);
        this.totalElementCoordinatorMessage = res.data.totalElement;
        this.coordinatorMessageParams.page =
          this.coordinatorMessageParams.page + 1;
        this.isLoadingCoordinatorMessage = false;
        if (selectAll) {
          const allCoordinator = this.coordinatorMessageData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allCoordinator.forEach((coordinator) => {
            const isCoordinatorAlreadySelected =
              this.selectedCoordinatorMessageSearch.some(
                (selectedCoordinator) =>
                  selectedCoordinator._id === coordinator._id
              );

            if (!isCoordinatorAlreadySelected) {
              this.selectedCoordinatorMessageSearch.push(coordinator);
            }
          });

          this.opinionForm.patchValue({
            coordinatorMessage: this.selectedCoordinatorMessageSearch,
          });
          this.isLoadingCoordinatorMessageSelectAll = false;
        }
      });
  }

  onInfiniteScrollCoordinatorMessage(): void {
    if (
      this.coordinatorMessageData.length < this.totalElementCoordinatorMessage
    ) {
      this.getCoordinatorMessageData(false);
    }
  }

  searchCoordinatorMessage(filterValue: string) {
    clearTimeout(this.timeoutCoordinatorMessage);
    this.timeoutCoordinatorMessage = setTimeout(() => {
      this.coordinatorMessageParams.search = filterValue.trim();
      this.coordinatorMessageParams.page = 1;
      this.coordinatorMessageParams.limit = 20;
      this.coordinatorMessageData = []; // Clear existing data when searching
      this.isLoadingCoordinatorMessage = false;
      this.getCoordinatorMessageData(false);
    }, 600);
  }

  onClickCoordinatorMessage(item) {
    const index = this.selectedCoordinatorMessageSearch.findIndex(
      (element) => element._id === item._id
    );
    if (index !== -1) {
      this.selectedCoordinatorMessageSearch.splice(index, 1);
    } else {
      this.selectedCoordinatorMessageSearch.push(item);
    }
    this.opinionForm.patchValue({
      coordinatorMessage: [...new Set(this.selectedCoordinatorMessageSearch)],
    });
  }

  selectAllCoordinatorMessage(event) {
    if (event.checked) {
      this.coordinatorMessageParams.page = 1;
      this.coordinatorMessageParams.limit = 0;
      this.isLoadingCoordinatorMessage = false;
      this.isLoadingCoordinatorMessageSelectAll = true;
      this.getCoordinatorMessageData(true);
    } else {
      this.selectedCoordinatorMessageSearch = [];
      this.opinionForm.patchValue({
        coordinatorMessage: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
